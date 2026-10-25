export type Experience = {
	company: string;
	title: string;
	link?: string;
	tenure: {
		startDate: {
			month: string;
			year: string;
		};
		endDate: {
			month: string;
			year: string;
		};
	};
	description: string;
	responsibilities: string[];
};

export const experienceData: Experience[] = [
	{
		company: 'Maritz',
		title: 'Application Developer',
		link: 'https://maritz.com/',
		tenure: {
			startDate: {
				month: 'July',
				year: '2024'
			},
			endDate: {
				month: 'Present',
				year: ``
			}
		},
		description:
			'Built enterprise applications and AI-powered tools, led engineering initiatives, and streamlined workflows through full-stack development, troubleshooting, and responsible AI adoption.',
		responsibilities: [
			'Built an MCP server in C# with multi-agent orchestration (tool calls, skills, and a custom agent) to enable AI-assisted debugging across application, API, and SQL Server layers, accelerating full-stack troubleshooting.',
			'Developed enterprise web applications using C#, .NET MVC, Angular, TypeScript, HTML, CSS, and SQL Server, modernizing business workflows and improving user experience.',
			'Created 8+ hours of AI training content and supporting documentation to educate engineers on responsible AI adoption, effective tool usage, and integrating AI workflows into their day-to-day development tasks.',
			'Developed an AI-powered event provisioning CLI using Node.js, TypeScript, and OpenAI APIs to automate repetitive setup workflows to reduce manual developer effort.',
			'Led a team of 4 engineers, establishing engineering standards, Agile workflows, and reusable architecture patterns to improve code consistency, development efficiency, and delivery speed.'
		]
	},
	{
		company: 'Maritz',
		title: 'Full Stack Web Developer',
		link: 'https://maritz.com/',
		tenure: {
			startDate: {
				month: 'May',
				year: '2023'
			},
			endDate: {
				month: 'July',
				year: '2024'
			}
		},
		description:
			'Built and maintained enterprise event registration platforms for events with 100K+ attendees, developing backend services, REST APIs, and housing API integrations using Classic ASP, PHP, TypeScript, JavaScript, and SQL Server.',
		responsibilities: [
			'Built and maintained enterprise event registration platforms using Classic ASP, PHP, TypeScript, JavaScript, jQuery, and SQL Server, supporting events with 100K+ attendees.',
			'Developed backend services and REST APIs to integrate application workflows with database systems.',
			'Contributed to updates to the internal housing API and advised on implementation strategies for consistent adoption across events.'
		]
	},
	{
		company: 'Imaginal Marketing Group',
		title: 'Web Developer',
		link: 'https://imaginalmarketing.com/',
		tenure: {
			startDate: {
				month: 'June',
				year: '2021'
			},
			endDate: {
				month: 'May',
				year: '2023'
			}
		},
		description: 'Developed accessible, SEO-focused client websites, built a Python monitoring tool that reduced support tickets by 50%, and architected a mobile-first SvelteKit app to recommend products and drive sales.',
		responsibilities: [
			'Developed accessible, SEO-focused web applications using PHP, Twig, and JavaScript, improving Core Web Vitals, SEO visibility, and UX/UI across client websites.',
			'Built a Python-based website monitoring tool that proactively detected site issues and reduced support tickets by 50%.',
			'Architected a mobile-first SvelteKit progressive web app, styled with Tailwind, that scraped provider websites to recommend relevant products to clients immediately after receiving services, driving additional product sales.'
		]
	}
];

/**
 * Ensures the portfolio URL has a protocol so it can be used with the URL constructor.
 * Falls back to https:// if no protocol is present.
 */
export function getPortfolioUrl(url: string): string {
	if (!url) return 'https://example.com';
	if (/^https?:\/\//i.test(url)) return url;
	return `https://${url}`;
}
