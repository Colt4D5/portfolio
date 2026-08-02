<script lang="ts">
	import {
		PUBLIC_EMAIL,
		PUBLIC_LINKEDIN_URL,
		PUBLIC_FIRST_NAME,
		PUBLIC_LAST_NAME,
		PUBLIC_PORTFOLIO_URL
	} from '$env/static/public';
	import { Mail, Globe } from '@lucide/svelte';
	import Linkedin from '$lib/assets/svg/linkedin.svelte';

	const currentYear = new Date().getFullYear();
</script>

<footer>
	<div id="footer-inner" class="section-container">
		<div class="footer-name">
			<h2>{PUBLIC_FIRST_NAME} {PUBLIC_LAST_NAME}</h2>
		</div>
		<div class="footer-copy">
			@ {currentYear}
			{PUBLIC_FIRST_NAME}
			{PUBLIC_LAST_NAME} | all rights reserved
		</div>
		<div class="footer-links">
			<a href="mailto:{PUBLIC_EMAIL}" rel="external" aria-label="Email">
				<Mail size={30} />
			</a>
			<a
				href={PUBLIC_LINKEDIN_URL}
				target="_blank"
				rel="noopener noreferrer external"
				aria-label="LinkedIn"
			>
				<Linkedin size={32} />
			</a>
			<a
				href={PUBLIC_PORTFOLIO_URL}
				target="_blank"
				rel="noopener noreferrer external"
				aria-label="Portfolio"
			>
				<Globe size={28} />
			</a>
		</div>
	</div>
</footer>

<style>
	footer {
		#footer-inner {
			margin-inline: auto;
			padding: 1rem 0;
			width: min(100%, var(--max-width));
			display: grid;
			grid-template-columns: auto 1fr auto;
			align-items: flex-end;
			gap: 2rem;
			.footer-name {
				margin: 0;
				padding: 0;
				line-height: 1;
				font-size: 1.25rem;
			}
			.footer-links {
				display: flex;
				gap: 1rem;
				a {
					display: flex;
					align-items: center;
					color: #fff;
					/* color: inherit; */
					text-decoration: none;
					transition: opacity 0.2s ease;
					&:hover {
						opacity: 0.7;
					}
				}
			}
		}
	}
</style>
