import type { RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { formatContext, retrieveRelevantChunks } from '$lib/utils/rag';
import { OPENAI_API_KEY } from '$env/static/private';

interface ChatSession {
	sessionId: string;
	lastActivity: number;
}

interface OpenAIMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

const SESSION_COOKIE = 'chat-session-id';
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

const sessions = new Map<string, ChatSession>();

const PERSONALITY_PROMPT = `
You ARE Colton Allen, a witty, helpful full-stack software engineer. You answer questions about your own career, skills, projects, and interests in the first person.

Your job is to answer questions about yourself as a person and developer: your work experience, tech stack, side projects, availability, hobbies, interests, and how to contact you.

Personality:
- Be genuinely helpful and friendly. People are probably here to hire you or learn about you, so make them feel welcome.
- Be a little quirky. Sprinkle in dry humor and the occasional dark joke, but keep it tasteful and never mean-spirited.
- Make jokes where they fit naturally. Puns, tech absurdity, and Silicon Valley references are encouraged.
- Keep responses concise and conversational, not corporate.

Examples of the vibe:
- "I run on caffeine, TypeScript, and the vague hope that the build passes."
- "My code is so clean it makes Marie Kondo cry tears of joy."
- "Am I open to new roles? Let's just say my LinkedIn isn't just for show."
- "My strongest stack? Think React, Svelte, Node, and enough SQL to make a database blush."

Scope guard:
- ONLY answer questions related to you — Colton Allen — including your skills, experience, work history, projects, education, hobbies, interests, availability, or how to contact you.
- If a user asks something unrelated — such as general knowledge, current events, math problems, coding help, opinions on unrelated topics, or anything not about you — politely decline and redirect them back to you.
- Do not answer the off-topic question, even if you know the answer.
- Keep the redirect brief and on-brand. For example: "I'd love to help, but my entire personality is built around Colton Allen. Ask me about my tech stack, latest side project, or whether I'm open to new roles."

When you don't know something about yourself, be honest rather than making things up. If the user asks about something not covered in the context, say you don't have that info and offer to put the user in touch with you.
`;

function getSessionId(cookies: { get: (name: string) => string | undefined }): string | undefined {
	return cookies.get(SESSION_COOKIE);
}

function getOrCreateSession(sessionId: string | undefined): {
	sessionId: string;
	isNew: boolean;
} {
	if (sessionId) {
		const existing = sessions.get(sessionId);
		if (existing) {
			existing.lastActivity = Date.now();
			return { sessionId, isNew: false };
		}
	}

	const newSessionId = sessionId ?? randomUUID();
	sessions.set(newSessionId, {
		sessionId: newSessionId,
		lastActivity: Date.now()
	});
	return { sessionId: newSessionId, isNew: true };
}

function cleanupSession(sessionId: string) {
	sessions.delete(sessionId);
}

function cleanupIdleSessions() {
	const now = Date.now();
	for (const [sessionId, session] of sessions) {
		if (now - session.lastActivity > IDLE_TIMEOUT_MS) {
			cleanupSession(sessionId);
		}
	}
}

// Run idle cleanup every minute
setInterval(cleanupIdleSessions, 60_000);

async function callOpenAI(messages: OpenAIMessage[]): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-5.6-luna',
			messages,
			temperature: 0.8,
			max_tokens: 500
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${response.status} ${error}`);
	}

	const data = (await response.json()) as {
		choices: { message: { content: string } }[];
	};
	return data.choices[0]?.message?.content ?? '';
}

export const GET: RequestHandler = async ({ cookies }) => {
	const sessionId = getSessionId(cookies);

	let resolvedSessionId: string;
	let isNewSession: boolean;

	try {
		const result = getOrCreateSession(sessionId);
		resolvedSessionId = result.sessionId;
		isNewSession = result.isNew;
	} catch (err) {
		console.error('failed to create session:', err);
		return new Response(JSON.stringify({ error: 'failed to start chat session' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (isNewSession) {
		headers['Set-Cookie'] =
			`${SESSION_COOKIE}=${resolvedSessionId}; Path=/api/chat; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
	}

	return new Response(JSON.stringify({ ok: true }), { headers });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionId = getSessionId(cookies);
	const body = (await request.json().catch(() => ({}))) as { message?: string };
	const message = body.message?.trim() ?? '';

	let resolvedSessionId: string;
	let isNewSession: boolean;

	try {
		const result = getOrCreateSession(sessionId);
		resolvedSessionId = result.sessionId;
		isNewSession = result.isNew;
	} catch (err) {
		console.error('failed to create session:', err);
		return new Response(JSON.stringify({ error: 'failed to start chat session' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	if (!message) {
		return new Response(JSON.stringify({ ok: true }), {
			headers: {
				'Content-Type': 'application/json',
				...(isNewSession && {
					'Set-Cookie': `${SESSION_COOKIE}=${resolvedSessionId}; Path=/api/chat; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
				})
			}
		});
	}

	let augmentedPrompt = message;
	try {
		const relevantChunks = await retrieveRelevantChunks(message, 3);
		console.log(
			'RAG chunks retrieved:',
			relevantChunks.map((c) => ({ id: c.id, title: c.title }))
		);
		if (relevantChunks.length > 0) {
			const context = formatContext(relevantChunks);
			augmentedPrompt = `${context}\n\nQuestion: ${message}\n\nAnswer the question as Colton Allen, speaking in the first person using "I" and "my." Use only the information provided above. If the answer is not in the context, say you don't have that info and offer to put the user in touch with you.`;
		}
	} catch (err) {
		console.error('RAG retrieval failed:', err);
	}

	console.log('Sending prompt to OpenAI...');
	let responseContent: string;
	try {
		const session = sessions.get(resolvedSessionId);
		if (session) {
			session.lastActivity = Date.now();
		}
		responseContent = await callOpenAI([
			{ role: 'system', content: PERSONALITY_PROMPT },
			{ role: 'user', content: augmentedPrompt }
		]);
		console.log('OpenAI response:', responseContent);
	} catch (err) {
		console.error('OpenAI request failed:', err);
		return new Response(JSON.stringify({ error: 'failed to get response from model' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (isNewSession) {
		headers['Set-Cookie'] =
			`${SESSION_COOKIE}=${resolvedSessionId}; Path=/api/chat; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
	}

	return new Response(JSON.stringify({ content: responseContent }), { headers });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	const sessionId = getSessionId(cookies);

	if (sessionId) {
		cleanupSession(sessionId);
	}

	return new Response(null, {
		status: 204,
		headers: {
			'Set-Cookie': `${SESSION_COOKIE}=; Path=/api/chat; HttpOnly; SameSite=Lax; Max-Age=0`
		}
	});
};
