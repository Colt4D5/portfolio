<script lang="ts">
	import { onMount } from 'svelte';
	import { spawnAnchorHoverParticle } from '$lib/utils/particles';

	let hoveredAnchor = $state<HTMLElement | null>(null);
	let animationFrameId = $state<number | null>(null);
	let frameCount = 0;
	let nextSpawnFrame = getRandomSpawnFrame();
	let reducedMotion = $state(false);
	let isVisible = $state(true);

	function getRandomSpawnFrame(): number {
		return Math.floor(Math.random() * 10) + 5; // 5 to 15 frames
	}

	function handleMouseOver(event: MouseEvent) {
		if (reducedMotion || !isVisible) return;

		const target = event.target as HTMLElement | null;
		if (!target) return;

		const anchor = target.closest('a');
		if (anchor instanceof HTMLElement && !anchor.classList.contains('button')) {
			hoveredAnchor = anchor;
			startLoop();
		}
	}

	function handleMouseOut(event: MouseEvent) {
		if (!hoveredAnchor) return;

		const relatedTarget = event.relatedTarget as Node | null;
		if (!relatedTarget || !hoveredAnchor.contains(relatedTarget)) {
			hoveredAnchor = null;
		}
	}

	function startLoop() {
		if (animationFrameId === null) {
			animationFrameId = requestAnimationFrame(loop);
		}
	}

	function stopLoop() {
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
	}

	function handleVisibilityChange() {
		isVisible = !document.hidden;
		if (document.hidden) {
			stopLoop();
		}
	}

	function loop() {
		animationFrameId = null;

		if (reducedMotion || document.hidden || !hoveredAnchor?.isConnected) {
			hoveredAnchor = null;
			frameCount = 0;
			nextSpawnFrame = getRandomSpawnFrame();
			return;
		}

		if (frameCount >= nextSpawnFrame) {
			spawnAnchorHoverParticle(hoveredAnchor);
			frameCount = 0;
			nextSpawnFrame = getRandomSpawnFrame();
		}
		frameCount++;

		animationFrameId = requestAnimationFrame(loop);
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mediaQuery.matches;
		isVisible = !document.hidden;

		const onChange = (event: MediaQueryListEvent) => {
			reducedMotion = event.matches;
			if (reducedMotion) {
				stopLoop();
			}
		};

		mediaQuery.addEventListener('change', onChange);
		document.addEventListener('mouseover', handleMouseOver);
		document.addEventListener('mouseout', handleMouseOut);
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			mediaQuery.removeEventListener('change', onChange);
			document.removeEventListener('mouseover', handleMouseOver);
			document.removeEventListener('mouseout', handleMouseOut);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			stopLoop();
		};
	});
</script>
