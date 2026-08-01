import { particles, type Particle } from '$lib/stores/particles.svelte';

const PRIMARY_VAR = '--primary';
const SECONDARY_VAR = '--secondary';
const ACCENT_VAR = '--accent';

const DEFAULT_PRIMARY = '#a175ff';
const DEFAULT_SECONDARY = '#61ffca';
const DEFAULT_ACCENT = '#80e1ff';

export function getHoverParticleColor(): string {
	const rootStyles = getComputedStyle(document.documentElement);
	const primary = rootStyles.getPropertyValue(PRIMARY_VAR).trim() || DEFAULT_PRIMARY;
	const secondary = rootStyles.getPropertyValue(SECONDARY_VAR).trim() || DEFAULT_SECONDARY;
	const accent = rootStyles.getPropertyValue(ACCENT_VAR).trim() || DEFAULT_ACCENT;

	const roll = Math.random();
	if (roll < 0.8) return primary;
	if (roll < 0.95) return secondary;
	return accent;
}

export function spawnAnchorHoverParticle(anchor: HTMLElement): void {
	if (!anchor.isConnected) return;

	const rect = anchor.getBoundingClientRect();
	if (rect.width === 0 || rect.height === 0) return;

	const particle: Particle = {
		x: Math.random() * rect.width + rect.left + window.scrollX,
		y: Math.random() * rect.height + rect.top + window.scrollY,
		size: Math.random() * 5 + 1,
		color: getHoverParticleColor(),
		velocityX: Math.random() * 2 - 1,
		velocityY: Math.random() * -3 - 1,
		gravity: 0.25
	};

	particles.push(particle);
}
