<script lang="ts">
	import { PUBLIC_FIRST_NAME } from '$env/static/public';
	import { chatbotState } from '$lib/stores/chatbot.svelte';
	import { Send, X, MessageCircle } from '@lucide/svelte';

	interface Message {
		id: number;
		text: string;
		sender: 'user' | 'bot';
	}

	let inputValue = $state('');
	let messagesContainer = $state<HTMLDivElement>();
	let isTyping = $state(false);
	let isReady = $state(false);
	let abortController = $state<AbortController | null>(null);

	const initialMessages: Message[] = [
		{
			id: 1,
			sender: 'bot',
			text: `hey there! i'm ${PUBLIC_FIRST_NAME}'s virtual assistant. think of me as a helpful engineer with just enough dry humor to keep things interesting. ask me about his experience, tech stack, availability, or how to get his resume — i promise i won't make you sit through a standup.`
		}
	];

	let messages = $state<Message[]>(initialMessages);

	const quickReplies = [
		{ text: 'are you open to new roles?', action: 'send' },
		{ text: 'what is your strongest tech stack?', action: 'send' },
		{ text: 'tell me about your experience', action: 'send' },
		{ text: 'can i see your resume?', action: 'download' }
	];

	function downloadResume() {
		const link = document.createElement('a');
		link.href = '/Colton Allen resume.pdf';
		link.download = `${PUBLIC_FIRST_NAME}_Colton Allen resume.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function handleQuickReply(reply: { text: string; action: string }) {
		if (reply.action === 'download') {
			downloadResume();
		} else {
			handleSend(reply.text);
		}
	}

	async function ensureSession() {
		if (isReady) return;

		isTyping = true;
		try {
			const response = await fetch('/api/chat', { method: 'GET' });
			if (!response.ok) throw new Error('failed to initialize session');
			isReady = true;
		} catch (err) {
			console.error('failed to initialize chat session:', err);
			messages = [
				...messages,
				{
					id: Date.now(),
					sender: 'bot',
					text: 'sorry, i had trouble starting the chat. please try again later.'
				}
			];
		} finally {
			isTyping = false;
		}
	}

	async function cleanup() {
		if (abortController) {
			abortController.abort();
			abortController = null;
		}
		try {
			await fetch('/api/chat', { method: 'DELETE' });
		} catch (err) {
			console.error('failed to cleanup chat session:', err);
		}
		isReady = false;
	}

	function toggleOpen() {
		chatbotState.isOpen = !chatbotState.isOpen;
		if (!chatbotState.isOpen) {
			cleanup();
		}
	}

	$effect(() => {
		if (chatbotState.isOpen) {
			scrollToBottom();
			ensureSession();
		}
	});

	$effect(() => {
		return () => {
			cleanup();
		};
	});

	async function handleSend(text: string = inputValue.trim()) {
		if (!text) return;

		const userMessage: Message = {
			id: Date.now(),
			sender: 'user',
			text
		};

		messages = [...messages, userMessage];
		inputValue = '';
		isTyping = true;
		scrollToBottom();

		const botMessageId = Date.now() + 1;
		messages = [...messages, { id: botMessageId, sender: 'bot', text: '' }];

		abortController = new AbortController();

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text }),
				signal: abortController.signal
			});

			if (!response.ok) {
				throw new Error('failed to send message');
			}

			const data = (await response.json()) as { content?: string; error?: string };
			console.log('chat response:', data);

			const current = messages.find((m) => m.id === botMessageId);
			if (current) {
				current.text = data.error ?? data.content ?? 'sorry, i got nothing. try again?';
				messages = [...messages];
			}
			scrollToBottom();
		} catch (err) {
			if ((err as Error).name === 'AbortError') return;
			console.error('failed to send message:', err);
			const current = messages.find((m) => m.id === botMessageId);
			if (current) {
				current.text = 'sorry, something went wrong. please try again.';
				messages = [...messages];
			}
		} finally {
			isTyping = false;
			abortController = null;
			scrollToBottom();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}

	function scrollToBottom() {
		requestAnimationFrame(() => {
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		});
	}
</script>

<div class="chatbot-popup" class:open={chatbotState.isOpen}>
	{#if chatbotState.isOpen}
		<div class="chat-window" role="dialog" aria-label="chat with {PUBLIC_FIRST_NAME}">
			<div class="chat-header">
				<div class="chat-avatar">
					<span>{PUBLIC_FIRST_NAME.charAt(0)}</span>
				</div>
				<div class="chat-title">
					<h3>chat with {PUBLIC_FIRST_NAME}</h3>
					<span class="status">online</span>
				</div>
				<button type="button" class="close-button" onclick={toggleOpen} aria-label="close chat">
					<X size={20} />
				</button>
			</div>

			<div class="messages" bind:this={messagesContainer}>
				{#each messages as message (message.id)}
					<div class="message" class:user={message.sender === 'user'}>
						<div class="message-bubble">
							<p>{message.text}</p>
						</div>
					</div>
				{/each}
				{#if isTyping}
					<div class="message">
						<div class="message-bubble typing">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				{/if}
			</div>

			<div class="quick-replies">
				{#each quickReplies as reply}
					<button type="button" class="quick-reply" onclick={() => handleQuickReply(reply)}>
						{reply.text}
					</button>
				{/each}
			</div>

			<div class="chat-input">
				<input
					type="text"
					bind:value={inputValue}
					onkeydown={handleKeydown}
					placeholder="type a message..."
					aria-label="message input"
				/>
				<button
					type="button"
					class="send-button"
					onclick={() => handleSend()}
					disabled={!inputValue.trim()}
					aria-label="send message"
				>
					<Send size={18} />
				</button>
			</div>
		</div>
	{/if}

	<button
		type="button"
		class="toggle-button"
		onclick={toggleOpen}
		aria-label={chatbotState.isOpen ? 'close chat' : 'open chat'}
		aria-expanded={chatbotState.isOpen}
	>
		{#if chatbotState.isOpen}
			<X size={24} />
		{:else}
			<MessageCircle size={24} />
		{/if}
	</button>
</div>

<style>
	.chatbot-popup {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 99999999;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.75rem;
		font-family: 'montserrat', 'Inter', sans-serif;
	}

	.toggle-button {
		--button-size: 3.5rem;
		width: var(--button-size);
		height: var(--button-size);
		border-radius: 50%;
		border: none;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		color: var(--background);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow:
			0 0 1.5rem hsl(from var(--primary) h s l / 0.4),
			0 0.25rem 1rem rgb(0 0 0 / 0.3);
		transition:
			transform 0.3s var(--bounce-curve-sml),
			box-shadow 0.3s ease;
	}

	.toggle-button:hover {
		transform: scale(1.1);
		box-shadow:
			0 0 2rem hsl(from var(--primary) h s l / 0.6),
			0 0.25rem 1rem rgb(0 0 0 / 0.3);
	}

	.toggle-button:active {
		transform: scale(0.95);
	}

	.chat-window {
		width: min(32rem, calc(100dvw - 2rem));
		background-color: rgb(from var(--background) r g b / 0.95);
		backdrop-filter: blur(12px);
		border: 1px solid hsl(from var(--primary) h s l / 0.25);
		border-radius: 1rem;
		box-shadow:
			0 0 2rem hsl(from var(--primary) h s l / 0.2),
			0 1rem 3rem rgb(0 0 0 / 0.4);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		max-height: min(40rem, calc(100dvh - 6rem));
		animation: pop-in 0.3s var(--bounce-curve-sml);
	}

	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(1rem) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.chat-header {
		background: linear-gradient(135deg, var(--primary), var(--accent));
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--background);
	}

	.chat-avatar {
		--avatar-size: 2.5rem;
		width: var(--avatar-size);
		height: var(--avatar-size);
		border-radius: 50%;
		background-color: var(--background);
		color: var(--primary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Pixelify Sans', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.chat-title {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;

		h3 {
			font-family: 'Pixelify Sans', sans-serif;
			font-size: 1.1rem;
			margin: 0;
			line-height: 1;
		}

		.status {
			font-size: 0.75rem;
			opacity: 0.9;
			display: flex;
			align-items: center;
			gap: 0.35rem;

			&::before {
				content: '';
				width: 0.5rem;
				height: 0.5rem;
				border-radius: 50%;
				background-color: var(--secondary);
				box-shadow: 0 0 0.5rem var(--secondary);
			}
		}
	}

	.close-button {
		background: transparent;
		border: none;
		color: var(--background);
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
		transition: background-color 0.2s ease;
	}

	.close-button:hover {
		background-color: rgb(0 0 0 / 0.1);
	}

	.messages {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.message {
		display: flex;

		&.user {
			justify-content: flex-end;
		}
	}

	.message-bubble {
		max-width: 80%;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		background-color: hsl(from var(--primary) h s l / 0.15);
		border: 1px solid hsl(from var(--primary) h s l / 0.2);
		color: var(--text);
		font-size: 0.9rem;
		line-height: 1.4;

		p {
			margin: 0;
		}
	}

	.user .message-bubble {
		background: linear-gradient(135deg, var(--primary), var(--accent));
		color: var(--background);
		border-color: transparent;
	}

	.typing {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.875rem 1rem;

		span {
			width: 0.4rem;
			height: 0.4rem;
			border-radius: 50%;
			background-color: var(--text);
			opacity: 0.5;
			animation: bounce 1.4s ease-in-out infinite both;
		}

		span:nth-child(1) {
			animation-delay: -0.32s;
		}
		span:nth-child(2) {
			animation-delay: -0.16s;
		}
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-0.35rem);
		}
	}

	.quick-replies {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0 1rem 0.75rem;
	}

	.quick-reply {
		background-color: transparent;
		border: 1px solid hsl(from var(--secondary) h s l / 0.4);
		color: var(--secondary);
		padding: 0.4rem 0.75rem;
		border-radius: 2rem;
		font-size: 0.8rem;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
		font-family: 'montserrat', 'Inter', sans-serif;
	}

	.quick-reply:hover {
		background-color: var(--secondary);
		color: var(--background);
	}

	.chat-input {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem 1rem 1rem;
		border-top: 1px solid hsl(from var(--primary) h s l / 0.15);
	}

	.chat-input input {
		flex: 1;
		background-color: hsl(from var(--primary) h s l / 0.1);
		border: 1px solid hsl(from var(--primary) h s l / 0.2);
		border-radius: 2rem;
		padding: 0.6rem 1rem;
		color: var(--text);
		font-family: 'montserrat', 'Inter', sans-serif;
		font-size: 0.9rem;
		outline: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.chat-input input::placeholder {
		color: hsl(from var(--text) h s l / 0.5);
	}

	.chat-input input:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0.75rem hsl(from var(--accent) h s l / 0.2);
	}

	.send-button {
		--send-size: 2.5rem;
		width: var(--send-size);
		height: var(--send-size);
		border-radius: 50%;
		border: none;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		color: var(--background);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.send-button:hover:not(:disabled) {
		transform: scale(1.1);
	}

	.send-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	@media (prefers-reduced-motion: reduce) {
		.chat-window {
			animation: none;
		}

		.toggle-button,
		.send-button,
		.close-button,
		.quick-reply {
			transition: none;
		}
	}
</style>
