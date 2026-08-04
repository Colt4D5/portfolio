import 'dotenv/config';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
	console.error('Error: OPENAI_API_KEY is required.');
	console.error('Add it to your .env file and try again.');
	process.exit(1);
}

interface Document {
	id: string;
	title: string;
	content: string;
	metadata?: Record<string, unknown>;
}

interface Chunk {
	id: string;
	documentId: string;
	title: string;
	content: string;
	metadata?: Record<string, unknown>;
}

interface EmbeddingRecord extends Chunk {
	embedding: number[];
}

interface KnowledgeFile {
	documents: Document[];
}

interface EmbeddingsFile {
	chunks: EmbeddingRecord[];
	model: string;
	generatedAt: string;
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 100;

function loadKnowledge(path: string): KnowledgeFile {
	const raw = readFileSync(path, 'utf-8');
	return JSON.parse(raw) as KnowledgeFile;
}

function splitIntoSentences(text: string): string[] {
	const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
	if (!sentences || sentences.length === 0) return [text];
	return sentences.map((s) => s.trim()).filter(Boolean);
}

function createChunk(doc: Document, content: string, index: number): Chunk {
	return {
		id: `${doc.id}-chunk-${index}`,
		documentId: doc.id,
		title: doc.title,
		content,
		metadata: doc.metadata
	};
}

function chunkDocument(doc: Document): Chunk[] {
	const chunks: Chunk[] = [];
	const paragraphs = doc.content
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);

	let chunkIndex = 0;
	for (const paragraph of paragraphs) {
		if (paragraph.length <= CHUNK_SIZE) {
			chunks.push(createChunk(doc, paragraph, chunkIndex++));
			continue;
		}

		const sentences = splitIntoSentences(paragraph);
		let currentChunk = '';

		for (const sentence of sentences) {
			if (currentChunk.length + sentence.length > CHUNK_SIZE && currentChunk.length > 0) {
				chunks.push(createChunk(doc, currentChunk.trim(), chunkIndex++));
				currentChunk = currentChunk.slice(-CHUNK_OVERLAP) + ' ' + sentence;
			} else {
				currentChunk += (currentChunk ? ' ' : '') + sentence;
			}
		}

		if (currentChunk.trim()) {
			chunks.push(createChunk(doc, currentChunk.trim(), chunkIndex++));
		}
	}

	return chunks;
}

async function fetchEmbeddings(texts: string[]): Promise<number[][]> {
	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: EMBEDDING_MODEL,
			input: texts
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${response.status} ${error}`);
	}

	const data = (await response.json()) as { data: { embedding: number[]; index: number }[] };
	return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

async function main() {
	const knowledgePath = resolve(__dirname, '../src/lib/data/knowledge.json');
	const outputPath = resolve(__dirname, '../src/lib/data/embeddings.json');

	if (!existsSync(knowledgePath)) {
		console.error(`Knowledge file not found: ${knowledgePath}`);
		process.exit(1);
	}

	const { documents } = loadKnowledge(knowledgePath);
	console.log(`Processing ${documents.length} documents...`);

	const chunks = documents.flatMap(chunkDocument);
	console.log(`Generated ${chunks.length} chunks`);

	const embeddings: EmbeddingRecord[] = [];
	const batchCount = Math.ceil(chunks.length / BATCH_SIZE);

	for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
		const batch = chunks.slice(i, i + BATCH_SIZE);
		console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${batchCount}...`);
		const vectors = await fetchEmbeddings(batch.map((c) => c.content));

		for (let j = 0; j < batch.length; j++) {
			embeddings.push({ ...batch[j], embedding: vectors[j] });
		}
	}

	const output: EmbeddingsFile = {
		chunks: embeddings,
		model: EMBEDDING_MODEL,
		generatedAt: new Date().toISOString()
	};

	mkdirSync(dirname(outputPath), { recursive: true });
	writeFileSync(outputPath, JSON.stringify(output, null, 2));
	console.log(`Wrote ${embeddings.length} embeddings to ${outputPath}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
