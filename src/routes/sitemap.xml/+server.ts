import { PUBLIC_PORTFOLIO_URL } from '$env/static/public';
import { getPortfolioUrl } from '$lib/utils/utils';

export const prerender = true;

export async function GET() {
	const portfolioUrl = getPortfolioUrl(PUBLIC_PORTFOLIO_URL);
	const pages = [{ path: '', lastmod: '2026-08-02', changefreq: 'monthly', priority: '1.0' }];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `	<url>
		<loc>${new URL(page.path, portfolioUrl).href}</loc>
		<lastmod>${page.lastmod}</lastmod>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
