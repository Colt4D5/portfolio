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
		title: 'Full Stack Application Developer',
		link: 'https://maritz.com/',
		tenure: {
			startDate: {
				month: 'July',
				year: '2024'
			},
			endDate: {
				month: 'Present',
				year: `${new Date().getFullYear()}`
			}
		},
		description:
			'Engineered scalable enterprise web applications using Angular, TypeScript, JavaScript, HTML, and CSS, simplifying complex business workflows and improving user experience.',
		responsibilities: [
			'Led a 4-engineer team, establishing engineering standards, Agile workflows, and reusable architectural patterns that improved delivery consistency and velocity.',
			'Championed AI adoption by architecting a custom MCP server in C#, enabling AI-assisted end-to-end debugging across application, API, and SQL database layers for the engineering team.',
			'Developed an AI-powered CLI using Node.js, TypeScript, and OpenAI APIs that automated event provisioning and streamlined developer workflows.',
			'Defined AI governance standards and mentored cross-functional teams on responsible AI adoption and developer best practices.',
			'Partnered with leadership to identify migration bottlenecks, implementing AI-enabled workflows and automation that reduced time spent migrating documentation by hand.'
		]
	},
	{
		company: 'Convention Data Services',
		title: 'Full Stack Web Developer',
		link: 'https://maritz.com/resources/press-release-070824/',
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
			'Engineered enterprise registration platforms using ASP, PHP, TypeScript, JavaScript, and SQL Server supporting events with 100K+ attendees.',
		responsibilities: [
			'Implemented front-end features using TypeScript, JavaScript, HTML, and CSS, enhancing user experience and accessibility.',
			'Developed REST APIs and backend services in ASP and PHP following object-oriented design principles (OOP).'
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
		description: 'Worked on developing web applications using modern frameworks and technologies.',
		responsibilities: [
			'Developed accessible, SEO-optimized web applications using PHP, Twig, and JavaScript, improving Core Web Vitals and search performance.',
			'Built a Python automation tool that monitored website health, reducing support tickets by 50%.',
			'Architected a mobile-first SvelteKit application with personalized recommendations that increased product sales.',
			'Designed REST APIs integrating frontend applications with backend services and SQL databases.'
		]
	}
];
