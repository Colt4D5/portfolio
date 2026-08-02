import { PUBLIC_PORTFOLIO_URL } from '$env/static/public';
import { getPortfolioUrl } from '$lib/utils/utils';

export const prerender = true;

export async function GET() {
	const portfolioUrl = getPortfolioUrl(PUBLIC_PORTFOLIO_URL);
	const sitemapUrl = new URL('/sitemap.xml', portfolioUrl).href;

	const robots = `# Allow crawling everything by default
User-agent: *
Allow: /

# Block admin/private areas if they exist
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: ${sitemapUrl}
`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}
