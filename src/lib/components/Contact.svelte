<script lang="ts">
	import Button from './Button.svelte';
	import { PUBLIC_EMAIL } from '$env/static/public';
</script>

<section id="contact" class="boxed-in">
	<div class="section-container">
		<div class="section-content">
			<h2>Let's build something awesome together!</h2>
			<p>I'm always open to new opportunities and interesting projects.</p>
			<Button href="mailto:{PUBLIC_EMAIL}" variant="alt">get in touch</Button>
		</div>
	</div>
</section>

<style>
	#contact {
		margin-block: 0;
		padding-top: 0;
		content-visibility: auto;
    
		.section-container {
      background-image: url('/images/contact-bg.webp');
      background-size: cover;
      background-position: 80% 70%;
      background-repeat: no-repeat;
			padding: 4rem 2rem;
			@media (min-width: 768px) {
				padding: 6rem 2rem;
				background-position: 50% 70%;
			}
			.section-content {
				text-align: left;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				gap: 1rem;
				width: min(clamp(20rem, 50%, 40rem), 100%);
				margin-inline: auto;
				h2 {
					font-size: 1.75rem;
					line-height: 1.1;
				}
				p {
					font-size: 1rem;
				}
			}
		}
	}
</style>
