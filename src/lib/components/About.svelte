<script>
	import { PUBLIC_FIRST_NAME, PUBLIC_LAST_NAME } from '$env/static/public';
</script>

<section id="about">
	<div class="section-container">
		<div class="grid">
			<div id="about-left">
				<h2 class="section-title">About Me</h2>
				<p>
					I'm the kind of developer who enjoys both building polished user interfaces and digging
					through backend code to figure out why something broke. I love solving puzzles, learning
					new technologies, and finding ways to automate work that nobody actually enjoys doing.
					Fair warning: if you mention a cool idea, there's a decent chance I'll build a prototype
					before the conversation is over.
				</p>
			</div>
			<div id="about-right">
				<div id="image-container">
					<img
						src="/images/about-image.webp"
						alt="{PUBLIC_FIRST_NAME} {PUBLIC_LAST_NAME} | Full-Stack Software Engineer"
						width="512"
						height="365"
						loading="lazy"
						decoding="async"
					/>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#about {
		.section-container {
			@media (max-width: 767px) {
				padding: 0rem 1rem;
			}
			#about-left {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				gap: 1rem;
			}
			#about-right {
				@media (max-width: 767px) {
					order: -1;
				}
				#image-container {
					border: 1px solid hsl(from var(--primary) h s l / 0.2);
					border-radius: 1rem;
					aspect-ratio: 16/9;
					overflow: hidden;
					img {
						width: 100%;
						max-height: 100%;
						object-fit: cover;
						object-position: center;
						border-radius: 1rem;
					}
				}
			}
		}
		content-visibility: auto;
	}
</style>
