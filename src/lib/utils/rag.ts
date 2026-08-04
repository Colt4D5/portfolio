import { OPENAI_API_KEY } from '$env/static/private';
import embeddings from '$lib/data/embeddings.json';

interface EmbeddingChunk {
	id: string;
	documentId: string;
	title: string;
	content: string;
	embedding: number[];
	metadata?: Record<string, unknown>;
}

interface EmbeddingsFile {
	chunks: EmbeddingChunk[];
	model: string;
	generatedAt: string;
}

const { chunks } = embeddings as EmbeddingsFile;
const EMBEDDING_MODEL = 'text-embedding-3-small';

function cosineSimilarity(a: number[], b: number[]): number {
	let dot = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embedQuery(text: string): Promise<number[]> {
	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: EMBEDDING_MODEL,
			input: text
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${response.status} ${error}`);
	}

	const data = (await response.json()) as { data: { embedding: number[] }[] };
	return data.data[0].embedding;
}

export async function retrieveRelevantChunks(query: string, topK = 3): Promise<EmbeddingChunk[]> {
	if (chunks.length === 0) return [];

	const queryEmbedding = await embedQuery(query);
	const scored = chunks.map((chunk) => ({
		chunk,
		score: cosineSimilarity(queryEmbedding, chunk.embedding)
	}));

	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, topK).map((s) => s.chunk);
}

export function formatContext(relevantChunks: EmbeddingChunk[]): string {
	if (relevantChunks.length === 0) return '';

	const sections = relevantChunks.map((chunk, i) => `[${i + 1}] ${chunk.title}\n${chunk.content}`);

	return `You are Colton Allen. Use the following information about yourself to answer the question. Speak in the first person using "I" and "my." Only use facts from the context below. If the answer is not in the context, say you don't have that info and offer to put the user in touch with you.\n\n${sections.join('\n\n')}`;
}
