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
      {#each experienceData as experience, i}
        {@render experienceItem(experience, i)}
      {/each}
    </div>
  </div>
</section>

{#snippet experienceItem(job: Experience, i: number)}
  <div class="exp-item" class:in-view={activeIndex === i} use:observe={i}>
    <div class="exp-year">
      <h3>{job.tenure.startDate.month} {job.tenure.startDate.year} - {job.tenure.endDate.month} {job.tenure.endDate.year}</h3>
    </div>
    <div class="exp-timeline"></div>
    <div class="exp-details">
      <h3>{job.title}</h3>
      {#if job.link}
        <h4 class="themed"><a href={job.link}>{job.company}</a></h4>
      {:else}
        <h4 class="themed">{job.company}</h4>
      {/if}
      <p>{job.description}</p>
      <ul>
        {#each job.responsibilities as responsibility}
          <li>{responsibility}</li>
        {/each}
      </ul>
    </div>
  </div>
{/snippet}

<style>
  #experience {
    padding-block: 0;
    .section-container {
      #exp-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        .exp-item {
          display: grid;
          grid-template-columns: 1fr auto 3fr;
          grid-template-rows: auto;
          gap: 2rem;

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
            text-align: center;
            transform: color 0.3s ease;
          }
          .exp-timeline {
            position: relative;
            &::before {
              content: '';
              display: block;
              width: 1rem;
              aspect-ratio: 1;
              background-color: var(--secondary);
              box-shadow: 
                0 0 0 0.6rem var(--background),
                0 0 0 0.75rem var(--text);
              border-radius: 50%;
              position: relative;
              z-index: 2;
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
            h3 {
              font-size: 1.25em;
              transition: all 0.3s ease;
              transform-origin: left center;
            }
          }
        }
      }
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 
        0 0 0 0.6rem var(--background),
        0 0 0 0.75rem var(--text);
    }
    50% {
      box-shadow: 
        0 0 0 1rem var(--background),
        0 0 0 1.25rem var(--text);
    }
    100% {
      box-shadow: 
        0 0 0 0.6rem var(--background),
        0 0 0 0.75rem var(--text);
    }
  }
</style>