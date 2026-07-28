export type Cloud = {
	x: number;
	y: number;
	width: number;
	height: number;
	velocityX: number;
	image: HTMLImageElement;
};

export const clouds = $state<Cloud[]>([]);
