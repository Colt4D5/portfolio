<script lang="ts">
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { PUBLIC_FIRST_NAME, PUBLIC_LAST_NAME } from '$env/static/public';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/assets/css/reset.css';
	import '$lib/assets/css/fonts.css';
	import '$lib/assets/css/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import ForegroundCanvas from '$lib/components/ForegroundCanvas.svelte';
	import AnchorHoverParticles from '$lib/components/AnchorHoverParticles.svelte';
	import { onMount } from 'svelte';

	injectSpeedInsights();

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();

	let scrollY = $state(0);
	let lastScrollY = $state(0);

	let flgIsHidden = $derived((scrollY > lastScrollY && scrollY > 100) || scrollY < 500);

	function onscroll() {
		lastScrollY = scrollY;
		scrollY = window.scrollY;
	}

	onMount(() => {
		const sections = Array.from(document.querySelectorAll('section:has(.section-container)'));
		let remaining = sections.length;

		function markInView(section: Element) {
			if (section.classList.contains('in-view')) return;
			section.classList.add('in-view');
			remaining--;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						markInView(entry.target);
						if (remaining <= 0) {
							observer.disconnect();
						}
					}
				});
			},
			{ threshold: 0, rootMargin: '0px 0px -50px 0px' }
		);

		sections.forEach((section) => observer.observe(section));

		// Catch sections already in viewport after refresh/scroll restoration
		requestAnimationFrame(() => {
			const viewportHeight = window.innerHeight;
			sections.forEach((section) => {
				const rect = section.getBoundingClientRect();
				if (rect.top < viewportHeight && rect.bottom > 0) {
					markInView(section);
				}
			});
			if (remaining <= 0) {
				observer.disconnect();
			}
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{PUBLIC_FIRST_NAME} {PUBLIC_LAST_NAME} | Full-Stack Software Engineer</title>
</svelte:head>

<a href="#content" class="skip-link">skip to main content</a>

<Header {flgIsHidden} />

<main id="content">
	{@render children()}
</main>

<Footer />

<ForegroundCanvas />

<AnchorHoverParticles />

<svelte:window {onscroll} />

<style>
	.skip-link {
		position: absolute;
		top: -100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10000;
		padding: 0.75rem 1.25rem;
		background: var(--background);
		color: var(--text);
		border: 2px solid var(--accent);
		border-radius: 0.5rem;
		font-weight: 700;
		text-decoration: none;
		transition: top 0.2s ease;
	}

	.skip-link:focus {
		top: 1rem;
	}
</style>
