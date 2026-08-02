<script lang="ts">
	import { experienceData, type Experience } from '$lib/utils/utils';

	let activeIndex = $state<number | null>(null);

	function observe(node: HTMLElement, index: number) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeIndex = index;
					} else if (activeIndex === index) {
						activeIndex = null;
					}
				});
			},
			{ threshold: 0.6, rootMargin: '-40% 0px 0px 0px' }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<section id="experience" class="boxed-in">
	<div class="section-container">
		<h2 class="section-title">Experience</h2>
		<div id="exp-grid">
			{#each experienceData as experience, i (experience.title + experience.company)}
				{@render experienceItem(experience, i)}
			{/each}
		</div>
	</div>
</section>

{#snippet experienceItem(job: Experience, i: number)}
	<div class="exp-item" class:in-view={activeIndex === i} use:observe={i}>
		<div class="exp-year">
			<h3>
				{job.tenure.startDate.month}
				{job.tenure.startDate.year} - {job.tenure.endDate.month}
				{job.tenure.endDate.year}
			</h3>
		</div>
		<div class="exp-timeline"></div>
		<div class="exp-details">
			<h3>{job.title}</h3>
			{#if job.link}
				<h4 class="themed"><a href={job.link} rel="external">{job.company}</a></h4>
			{:else}
				<h4 class="themed">{job.company}</h4>
			{/if}
			<p>{job.description}</p>
			<ul>
				{#each job.responsibilities as responsibility, ri (ri)}
					<li>{responsibility}</li>
				{/each}
			</ul>
		</div>
	</div>
{/snippet}

<style>
	#experience {
		padding-top: 2rem;
    padding-bottom: 0;
		content-visibility: auto;
		.section-container {
			@media (max-width: 767px) {
				padding: 3rem 1rem;
			}
			/* h2.section-title {} */
			#exp-grid {
				display: flex;
				flex-direction: column;
				gap: 2rem;
				.exp-item {
					display: grid;
					grid-template-columns: 1fr auto 3fr;
					grid-template-rows: 1fr;
					grid-template-areas: 'year timeline details';
					gap: 1rem 2rem;
					@media (max-width: 767px) {
						grid-template-columns: auto 1fr;
						grid-template-areas:
							'timeline year'
							'timeline details';
						gap: 1rem 1rem;
					}
					&.in-view {
						.exp-year h3 {
							color: var(--secondary);
						}
						.exp-timeline::before {
							animation: pulse 1.5s infinite;
						}
						.exp-details h3 {
							transform: scale(1.2);
							color: var(--secondary);
						}
					}
					.exp-year {
						grid-area: year;
						text-align: left;
						transition: color 0.3s ease;
						@media (min-width: 768px) {
							text-align: center;
						}
					}
					.exp-timeline {
						grid-area: timeline;
						position: relative;
						transform: translateY(0.5rem);
						@media (max-width: 767px) {
							order: -1;
						}
						&::before {
							content: '';
							display: block;
							width: 0.75rem;
							aspect-ratio: 1;
							background-color: var(--secondary);
							box-shadow:
								0 0 0 0.3rem var(--background),
								0 0 0 0.5rem var(--text);
							border-radius: 50%;
							position: relative;
							z-index: 2;
							@media (min-width: 768px) {
								width: 1rem;
								box-shadow:
									0 0 0 0.6rem var(--background),
									0 0 0 0.75rem var(--text);
							}
						}
						&::after {
							content: '';
							display: block;
							width: 0.25rem;
							height: 100%;
							background-color: var(--secondary);
							position: absolute;
							top: 1.5rem;
							left: 50%;
							transform: translateX(-50%);
							z-index: 1;
						}
					}
					.exp-details {
						grid-area: details;
						h3 {
							font-size: 1.25em;
							transition: all 0.3s ease;
							transform-origin: left center;
							line-height: 1.2;
						}
						h4 {
							margin-bottom: 0.5rem;
						}
						ul {
							@media (max-width: 767px) {
								list-style-type: disc;
								padding-left: 1rem;
							}
						}
					}
				}
			}
		}
	}

	@keyframes pulse {
		0% {
			box-shadow:
				0 0 0 clamp(0.3rem, 3vw, 0.6rem) var(--background),
				0 0 0 clamp(0.5rem, 3vw, 0.75rem) var(--text);
		}
		50% {
			box-shadow:
				0 0 0 clamp(0.6rem, 3vw, 1rem) var(--background),
				0 0 0 clamp(0.8rem, 3vw, 1.25rem) var(--text);
		}
		100% {
			box-shadow:
				0 0 0 clamp(0.3rem, 3vw, 0.6rem) var(--background),
				0 0 0 clamp(0.5rem, 3vw, 0.75rem) var(--text);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.exp-item.in-view .exp-details h3 {
			transform: none;
		}
		.exp-item.in-view .exp-timeline::before {
			animation: none;
		}
	}
</style>
