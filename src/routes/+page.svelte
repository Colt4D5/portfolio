<script>
	import {
		PUBLIC_FIRST_NAME,
		PUBLIC_LAST_NAME,
		PUBLIC_EMAIL,
		PUBLIC_LINKEDIN_URL,
		PUBLIC_PORTFOLIO_URL
	} from '$env/static/public';
	import About from '$lib/components/About.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import { getPortfolioUrl } from '$lib/utils/utils';

	const fullName = `${PUBLIC_FIRST_NAME} ${PUBLIC_LAST_NAME}`;
	const portfolioUrl = getPortfolioUrl(PUBLIC_PORTFOLIO_URL);
	const imageUrl = new URL('/images/about-image.webp', portfolioUrl).href;

	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${portfolioUrl}/#website`,
				url: portfolioUrl,
				name: fullName,
				description: `Portfolio of ${fullName}, a full-stack software engineer.`,
				publisher: {
					'@id': `${portfolioUrl}/#person`
				},
				inLanguage: 'en'
			},
			{
				'@type': 'ProfilePage',
				'@id': `${portfolioUrl}/#profilepage`,
				url: portfolioUrl,
				name: fullName,
				isPartOf: {
					'@id': `${portfolioUrl}/#website`
				},
				mainEntity: {
					'@id': `${portfolioUrl}/#person`
				}
			},
			{
				'@type': 'Person',
				'@id': `${portfolioUrl}/#person`,
				name: fullName,
				givenName: PUBLIC_FIRST_NAME,
				familyName: PUBLIC_LAST_NAME,
				image: imageUrl,
				url: portfolioUrl,
				email: `mailto:${PUBLIC_EMAIL}`,
				jobTitle: 'Full-Stack Software Engineer',
				sameAs: [PUBLIC_LINKEDIN_URL],
				knowsAbout: [
					'Svelte',
					'SvelteKit',
					'TypeScript',
					'JavaScript',
					'Angular',
					'Node.js',
					'Python',
					'Web Development',
					'Full-Stack Development'
				]
			}
		]
	};

	const structuredDataScript =
		`<script type="application/ld+json">${JSON.stringify(structuredData)}</scr` + `ipt>`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html structuredDataScript}
</svelte:head>

<Hero />

<About />

<Experience />

<Contact />
