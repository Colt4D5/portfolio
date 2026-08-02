<script lang="ts">
	import type { Snippet } from 'svelte';
	import { particles } from '$lib/stores/particles.svelte';

	interface Props {
		children: Snippet;
		href?: string;
		delay?: number;
		variant?: 'default' | 'alt';
	}

	const { children, href, delay = 1000, variant = 'default' }: Props = $props();

	let button = $state<HTMLButtonElement | HTMLAnchorElement>();
	let isExploding = $state(false);

	const isExternal = $derived(
		href ? href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') : false
	);

	function handleClick(event: MouseEvent) {
		if (isExploding) return;

		event.preventDefault();
		isExploding = true;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!prefersReducedMotion) {
			explode();
		}

		setTimeout(() => {
			if (href) {
				window.location.href = href;
			}
			isExploding = false;
		}, delay);
	}

	function explode() {
		if (!button) return;
		const btnBox = button.getBoundingClientRect();
		for (let i = 0; i < 50; i++) {
			particles.push({
				x: Math.random() * btnBox.width + btnBox.left + window.scrollX,
				y: Math.random() * btnBox.height + btnBox.top + window.scrollY,
				size: Math.random() * 10 + 5,
				color: variant === 'alt' ? '#fff' : '#f57e24',
				velocityX: Math.random() * 6 - 3,
				velocityY: Math.random() * -6 - 3,
				gravity: 0.25
			});
		}
	}
</script>

{#if href}
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		{href}
		class="button"
		class:exploding={isExploding}
		class:alternate={variant === 'alt'}
		rel={isExternal ? 'external' : undefined}
		onclick={handleClick}
		bind:this={button}
	>
		{@render children()}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
	<button
		type="button"
		class="button"
		class:exploding={isExploding}
		class:alternate={variant === 'alt'}
		onclick={handleClick}
		bind:this={button}
	>
		{@render children()}
	</button>
{/if}

<style>
	.button {
		--button-color: var(--orange);
		font-family: 'Pixelify Sans', sans-serif;
		font-size: 1.25rem;
		padding: 1rem 1.5rem;
		background-color: transparent;
		color: var(--button-color);
		border: none;
		cursor: pointer;
		transition: background-color 0.3s ease;
		text-decoration: none;
		text-transform: lowercase;
		position: relative;
		&.alternate {
			--button-color: #fff;
		}
		&.exploding::after {
			box-shadow:
				var(--border-width) calc(var(--border-width) * -1) 0 0
					hsl(from var(--button-color) h s calc(l + 20) / 1),
				var(--border-width) var(--border-width) 0 hsl(from var(--button-color) h s calc(l + 20) / 1),
				calc(var(--border-width) * -1) var(--border-width) 0 0
					hsl(from var(--button-color) h s calc(l + 20) / 1),
				calc(var(--border-width) * -1) calc(var(--border-width) * -1) 0
					hsl(from var(--button-color) h s calc(l + 20) / 1);
		}
		&::after {
			--border-width: 0.5rem;
			content: '';
			display: block;
			position: absolute;
			top: var(--border-width);
			left: var(--border-width);
			width: calc(100% - (2 * var(--border-width)));
			height: calc(100% - (2 * var(--border-width)));
			transition: box-shadow 0.3s ease;
			box-shadow:
				0 calc(var(--border-width) * -1) 0 0 var(--button-color),
				var(--border-width) 0 0 var(--button-color),
				0 var(--border-width) 0 0 var(--button-color),
				calc(var(--border-width) * -1) 0 0 var(--button-color);
			/* pointer-events: none; */
		}
		&:not(.exploding):hover::after {
			box-shadow:
				var(--border-width) calc(var(--border-width) * -1) 0 0 var(--button-color),
				var(--border-width) var(--border-width) 0 var(--button-color),
				calc(var(--border-width) * -1) var(--border-width) 0 0 var(--button-color),
				calc(var(--border-width) * -1) calc(var(--border-width) * -1) 0 var(--button-color);
		}
	}
</style>
