import { PUBLIC_FIRST_NAME, PUBLIC_LAST_NAME } from '$env/static/public';

export const prerender = true;

export async function GET() {
	const fullName = `${PUBLIC_FIRST_NAME} ${PUBLIC_LAST_NAME}`;

	const manifest = {
		name: `${fullName} | Full-Stack Software Engineer`,
		short_name: fullName,
		description: `Portfolio of ${fullName}, a full-stack software engineer building scalable web applications and polished user interfaces.`,
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#6a1b9a',
		orientation: 'portrait-primary',
		categories: ['portfolio', 'developer', 'technology'],
		icons: [
			{
				src: '/favicon/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/favicon/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		]
	};

	return new Response(JSON.stringify(manifest), {
		headers: {
			'Content-Type': 'application/manifest+json'
		}
	});
}
