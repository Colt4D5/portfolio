<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/assets/css/reset.css';
	import '$lib/assets/css/fonts.css';
	import '$lib/assets/css/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import ForegroundCanvas from '$lib/components/ForegroundCanvas.svelte';

	let { children } = $props();

	let scrollY = $state(0);
	let lastScrollY = $state(0);

	let flgIsHidden = $derived(scrollY > lastScrollY && scrollY > 100 || scrollY < 500);

	function onscroll() {
		lastScrollY = scrollY;
		scrollY = window.scrollY;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header {flgIsHidden} />

<main id="content">
	{@render children()}
</main>

<Footer />

<ForegroundCanvas />
<svelte:window {onscroll} />