export type Particle = {
	x: number;
	y: number;
	size: number;
	color: string;
	velocityX: number;
	velocityY: number;
	gravity: number;
};

export const particles = $state<Particle[]>([]);
