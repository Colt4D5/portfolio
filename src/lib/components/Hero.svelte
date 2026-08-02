<script>
	import { PUBLIC_FIRST_NAME, PUBLIC_LAST_NAME } from '$env/static/public';
	import Button from './Button.svelte';
	import CityscapeCanvas from './CityscapeCanvas.svelte';

	const subtitle = 'full stack software engineer';
</script>

<section id="hero">
	<h1 id="hero-title">{PUBLIC_FIRST_NAME}<br />{PUBLIC_LAST_NAME}</h1>
	<div id="hero-subtitle" aria-label={subtitle}>
		{#each subtitle as char, i (i)}
			<span style="--letter-index: {i}" aria-hidden="true">{char === ' ' ? '\u00A0' : char}</span>
		{/each}
	</div>
	<div class="button-wrapper">
		<Button href="#about" delay={500} variant="alt">Learn about me</Button>
	</div>
	<CityscapeCanvas />
</section>

<style>
	@property --shadow-spacing {
		syntax: '<length>';
		inherits: false;
		initial-value: 1rem;
	}

	#hero {
		margin: 0;
		background-image: url('/images/hero-bg.jpg');
		background-size: 100% 100%;
		background-position: center;
		background-repeat: no-repeat;
		min-height: 100dvh;
		content-visibility: auto;

		/* background-image: linear-gradient(to bottom, hsl(263, 100%, 53%), hsl(327, 74%, 62%) 50%, hsl(32, 100%, 64%), hsl(56, 100%, 76%), hsl(56, 60%, 86%), hsl(56, 60%, 86%) 100%); */
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		padding-top: 25vh;
		gap: 1.5rem;
		@media (min-width: 768px) {
			padding-top: 15vh;
		}
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 6rem;
			background: linear-gradient(to bottom, rgb(255 255 255 / 0), rgb(255 255 255 / 1));
		}
		h1 {
			font-family: 'Pixelify Sans', sans-serif;
			font-size: clamp(4rem, 24vmin, 14rem);
			line-height: 0.75;
			color: #ffefff;
			position: relative;
			z-index: 99999;
			translate: 0 var(--title-translate-y);
			opacity: 0;
			text-shadow:
				0 0 calc(var(--shadow-spacing) * 0) #ffff84,
				calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0 var(--title-shadow-color),
				calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0
					var(--title-shadow-color-dark);
			animation:
				slide-in 0.5s var(--bounce-curve) 0.5s forwards,
				animate-shadow 0.2s var(--bounce-curve) 1.25s forwards;
		}
		#hero-subtitle {
			font-family: 'Pixelify Sans', sans-serif;
			font-size: clamp(1.15rem, 4vw, 2rem);
			color: #fff;
			margin-top: 1rem;
			@media (min-width: 768px) {
				color: #f57e24;
			}
			span {
				display: inline-block;
				opacity: 0;
				translate: 0 1rem;
				animation: letter-in 0.3s ease-out forwards;
				animation-delay: calc(1.7s + var(--letter-index) * 0.05s);
			}
		}
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: url('/images/mountains-01.png'), url('/images/mountains-02.png');
			background-position:
				-215% calc(100% - 2.15rem),
				155% calc(100% - 2.25rem);
			background-repeat: no-repeat;
			background-size: 80%, 60%;
			pointer-events: none;
			z-index: 1;
			@media (min-width: 768px) {
				background-position:
					0% calc(100% - 3.25rem),
					100% calc(100% - 3.5rem);
				background-size: 45%, 45%;
			}
		}
		@media (max-width: 767px) and (orientation: portrait) {
			min-height: max(750px, 85dvh);
		}
	}

	@keyframes letter-in {
		to {
			opacity: 1;
			translate: 0 0;
		}
	}

	@keyframes slide-in {
		from {
			translate: 0 var(--title-translate-y);
			opacity: 1;
		}
		to {
			translate: 0 0;
			opacity: 1;
		}
	}

	@keyframes animate-shadow {
		from {
			text-shadow:
				0 0 calc(var(--shadow-spacing) * 0) #ffff84,
				calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0 var(--title-shadow-color),
				calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0
					var(--title-shadow-color-dark);
		}
		to {
			text-shadow:
				0 0 var(--shadow-spacing) #ffff84,
				calc(var(--shadow-spacing) * 0.5) calc(var(--shadow-spacing) * 0.5) 0
					var(--title-shadow-color),
				var(--shadow-spacing) var(--shadow-spacing) 0 var(--title-shadow-color-dark);
		}
	}

	.button-wrapper {
		opacity: 0;
		translate: 0 1rem;
		animation: fade-up 0.5s ease-out 3s forwards;
	}

	@keyframes fade-up {
		to {
			opacity: 1;
			translate: 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		#hero h1,
		#hero #hero-subtitle span,
		#hero .button-wrapper {
			opacity: 1;
			translate: 0 0;
			animation: none;
		}
	}
</style>
