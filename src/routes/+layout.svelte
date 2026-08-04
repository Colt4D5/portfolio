<script lang="ts">
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { page } from '$app/stores';
	import { PUBLIC_FIRST_NAME, PUBLIC_LAST_NAME, PUBLIC_PORTFOLIO_URL } from '$env/static/public';
	import '$lib/assets/css/reset.css';
	import '$lib/assets/css/fonts.css';
	import '$lib/assets/css/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import ForegroundCanvas from '$lib/components/ForegroundCanvas.svelte';
	import AnchorHoverParticles from '$lib/components/AnchorHoverParticles.svelte';
	import ChatbotPopup from '$lib/components/ChatbotPopup.svelte';
	import { getPortfolioUrl } from '$lib/utils/utils';
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

	const fullName = `${PUBLIC_FIRST_NAME} ${PUBLIC_LAST_NAME}`;
	const pageTitle = `${fullName} | Full-Stack Software Engineer`;
	const pageDescription = `Portfolio of ${fullName}, a full-stack software engineer building scalable web applications, polished user interfaces, and developer tooling.`;
	const portfolioUrl = getPortfolioUrl(PUBLIC_PORTFOLIO_URL);
	const canonicalUrl = $derived(new URL($page.url.pathname, portfolioUrl).href);
	const ogImageUrl = $derived(new URL('/images/about-image.webp', portfolioUrl).href);
	const isHomePage = $derived($page.url.pathname === '/');

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
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImageUrl} />
	<meta property="og:site_name" content={fullName} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={ogImageUrl} />

	<!-- Theme color for mobile browsers -->
	<meta name="theme-color" content="#6a1b9a" />
</svelte:head>

<a href="#content" class="skip-link">skip to main content</a>

<Header {flgIsHidden} />

<main id="content">
	{@render children()}
</main>

<Footer />

<ForegroundCanvas enableClouds={isHomePage} />

<AnchorHoverParticles />

<ChatbotPopup />

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
