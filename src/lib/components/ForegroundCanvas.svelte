<script lang="ts">
	import { onMount } from 'svelte';
	import { particles } from '$lib/stores/particles.svelte';
	import { clouds } from '$lib/stores/clouds.svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	let cloud: HTMLImageElement;
	let cloudPair: HTMLImageElement;
	let imagesLoaded = $state(0);
	let reducedMotion = $state(false);

	let lastSpawnTime = 0;
	let nextSpawnInterval = getRandomSpawnInterval();
	const maxClouds = 25;

	function getRandomSpawnInterval() {
		return Math.random() * 3000 + 2000; // 2-5 seconds
	}

	function spawnCloud() {
		if (!canvas || imagesLoaded < 2) return;

		const image = Math.random() < 0.5 ? cloud : cloudPair;
		const scale = Math.random() * 0.5 + 0.5; // 0.5x to 1x
		const width = image.naturalWidth * scale;
		const height = image.naturalHeight * scale;
		const maxY = window.innerHeight * 0.75 - height;
		const y = Math.random() * maxY;

		clouds.push({
			x: canvas.width,
			y,
			width,
			height,
			velocityX: Math.random() * 0.5 + 0.5, // 0.25-0.75 px/frame
			image
		});
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mediaQuery.matches;

		const onChange = (event: MediaQueryListEvent) => {
			reducedMotion = event.matches;
		};

		mediaQuery.addEventListener('change', onChange);

		cloud = new Image();
		cloudPair = new Image();
		cloud.src = '/images/sunset-cloud.webp';
		cloudPair.src = '/images/sunset-clouds.webp';
		cloud.onload = () => imagesLoaded++;
		cloudPair.onload = () => imagesLoaded++;

		if (canvas) {
			ctx = canvas.getContext('2d');
			if (ctx) {
				// Set the canvas size to match the window size
				canvas.width = document.documentElement.offsetWidth;
				canvas.height = document.documentElement.offsetHeight;

				animate();
			}
		}

		return () => {
			mediaQuery.removeEventListener('change', onChange);
		};
	});

	function onresize() {
		if (canvas) {
			canvas.width = document.documentElement.offsetWidth;
			canvas.height = document.documentElement.offsetHeight;
		}
	}

	function animate(timestamp = 0) {
		if (ctx && canvas) {
			if (reducedMotion) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				requestAnimationFrame(animate);
				return;
			}

			// Clear the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Spawn new clouds at random intervals
			if (timestamp - lastSpawnTime > nextSpawnInterval && clouds.length < maxClouds) {
				spawnCloud();
				lastSpawnTime = timestamp;
				nextSpawnInterval = getRandomSpawnInterval();
			}

			// Update and draw clouds
			for (let i = 0; i < clouds.length; i++) {
				const cloudItem = clouds[i];
				cloudItem.x -= cloudItem.velocityX;

				ctx.drawImage(cloudItem.image, cloudItem.x, cloudItem.y, cloudItem.width, cloudItem.height);

				// Remove cloud when fully off-screen to the left
				if (cloudItem.x + cloudItem.width < 0) {
					clouds.splice(i, 1);
					i--;
				}
			}

			if (particles.length) {
				// Draw each particle
				for (let i = 0; i < particles.length; i++) {
					const particle = particles[i];

					// Apply gravity to the particle's vertical velocity if not max speed
					if (particle.velocityY < 15) {
						particle.velocityY += particle.gravity;
					}

					// Update particle position
					particle.x += particle.velocityX;
					particle.y += particle.velocityY;

					// Draw the particle
					ctx.fillStyle = particle.color;
					ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

					// Remove the particle if it goes off-screen
					if (
						particle.x < 0 ||
						particle.x > canvas.width ||
						particle.y < 0 ||
						particle.y > canvas.height
					) {
						particles.splice(i, 1);
						i--;
					}
				}
			}
		}

		requestAnimationFrame(animate);
	}
</script>

<canvas id="foreground-canvas" bind:this={canvas} aria-hidden="true"></canvas>
<svelte:window {onresize} />

<style>
	canvas#foreground-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100%;
		pointer-events: none;
		z-index: 9999;
	}
</style>
