<script lang="ts">
	import { onMount } from 'svelte';
	import { spawnAnchorHoverParticle } from '$lib/utils/particles';

	let hoveredAnchor = $state<HTMLElement | null>(null);
	let animationFrameId = $state<number | null>(null);
	let frameCount = 0;
	let nextSpawnFrame = getRandomSpawnFrame();
	let reducedMotion = $state(false);

	function getRandomSpawnFrame(): number {
		return Math.floor(Math.random() * 10) + 5; // 5 to 15 frames
	}

	function handleMouseOver(event: MouseEvent) {
		if (reducedMotion) return;

		const target = event.target as HTMLElement | null;
		if (!target) return;

		const anchor = target.closest('a');
		if (anchor instanceof HTMLElement) {
			hoveredAnchor = anchor;
		}
	}

	function handleMouseOut(event: MouseEvent) {
		if (!hoveredAnchor) return;

		const relatedTarget = event.relatedTarget as Node | null;
		if (!relatedTarget || !hoveredAnchor.contains(relatedTarget)) {
			hoveredAnchor = null;
		}
	}

	function loop() {
		if (reducedMotion) {
			animationFrameId = requestAnimationFrame(loop);
			return;
		}

		if (hoveredAnchor?.isConnected) {
			if (frameCount >= nextSpawnFrame) {
				spawnAnchorHoverParticle(hoveredAnchor);
				frameCount = 0;
				nextSpawnFrame = getRandomSpawnFrame();
			}
			frameCount++;
		} else {
			hoveredAnchor = null;
			frameCount = 0;
			nextSpawnFrame = getRandomSpawnFrame();
		}

		animationFrameId = requestAnimationFrame(loop);
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mediaQuery.matches;

		const onChange = (event: MediaQueryListEvent) => {
			reducedMotion = event.matches;
		};

		mediaQuery.addEventListener('change', onChange);
		document.addEventListener('mouseover', handleMouseOver);
		document.addEventListener('mouseout', handleMouseOut);
		animationFrameId = requestAnimationFrame(loop);

		return () => {
			mediaQuery.removeEventListener('change', onChange);
			document.removeEventListener('mouseover', handleMouseOver);
			document.removeEventListener('mouseout', handleMouseOut);
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});
</script>
