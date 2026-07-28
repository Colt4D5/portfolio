<script lang="ts">
  import { goto } from '$app/navigation';
  interface Props {
    children: any;
    href?: string;
    delay?: number;
  }
  const { children, href, delay = 1000 }: Props = $props();
  import { particles } from '$lib/stores/paricles.svelte';

  let button = $state<HTMLButtonElement>();
  let isExploding = $state(false);

  function onclick(event: MouseEvent) {
    event.preventDefault();
    isExploding = true;
    explode();
    if (href) {
      setTimeout(() => {
        goto(href);
        isExploding = false;
      }, delay);
    }
  }

  function explode() {
    if (!button) return;
    const btnBox = button.getBoundingClientRect();
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * btnBox.width + btnBox.left + window.scrollX,
        y: Math.random() * btnBox.height + btnBox.top + window.scrollY,
        size: Math.random() * 10 + 5,
        color: '#f57e24',
        velocityX: Math.random() * 6 - 3,
        velocityY: Math.random() * -6 - 3,
        gravity: 0.25,
      });
    }
  }
</script>

{#if href}
  <button class="button" class:exploding={isExploding} {onclick} bind:this={button}>{@render children()}</button>
{:else}
  <button class="button" class:exploding={isExploding} bind:this={button}>{@render children()}</button>
{/if}

<style>
  .button {
    --button-color: var(--orange);
    font-family: 'Pixelify Sans', sans-serif;
    font-size: 1.25rem;
    padding: 1rem 1.5rem;
    background-color: transparent;
    color: var(--button-color);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-decoration: none;
    position: relative;
    &.exploding::after {
      box-shadow:
        var(--border-width) calc(var(--border-width) * -1) 0 0 hsl(from var(--button-color) h s calc(l + 20) / 1),
        var(--border-width) var(--border-width) 0 hsl(from var(--button-color) h s calc(l + 20) / 1),
        calc(var(--border-width) * -1) var(--border-width) 0 0 hsl(from var(--button-color) h s calc(l + 20) / 1),
        calc(var(--border-width) * -1) calc(var(--border-width) * -1) 0 hsl(from var(--button-color) h s calc(l + 20) / 1);
    }
    &::after {
      --border-width: 0.5rem;
      content: '';
      display: block;
      position: absolute;
      top: var(--border-width);
      left: var(--border-width);
      width: calc(100% - (2 * var(--border-width)));
      height: calc(100% - (2 * var(--border-width)));
      transition: box-shadow 0.3s ease;
      box-shadow:
        0 calc(var(--border-width) * -1) 0 0 var(--button-color),
        var(--border-width) 0 0 var(--button-color),
        0 var(--border-width) 0 0 var(--button-color),
        calc(var(--border-width) * -1) 0 0 var(--button-color);
      /* pointer-events: none; */
    }
    &:not(.exploding):hover::after {
      box-shadow:
        var(--border-width) calc(var(--border-width) * -1) 0 0 var(--button-color),
        var(--border-width) var(--border-width) 0 var(--button-color),
        calc(var(--border-width) * -1) var(--border-width) 0 0 var(--button-color),
        calc(var(--border-width) * -1) calc(var(--border-width) * -1) 0 var(--button-color);
    }
  }
</style>