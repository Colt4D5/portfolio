<script>
	import Button from "./Button.svelte";

  const subtitle = 'full stack software engineer';
</script>

<section id="hero">
  <h1 id="hero-title">colton<br>allen</h1>
  <div id="hero-subtitle">
    {#each subtitle as char, i (i)}
      <span style="--letter-index: {i}">{char === ' ' ? '\u00A0' : char}</span>
    {/each}
  </div>
  <div class="button-wrapper">
    <Button href="#about" delay={500}>View My Work</Button>
  </div>
</section>

<style>
  @property --shadow-spacing {
    syntax: '<length>';
    inherits: false;
    initial-value: 1rem;
  }

  #hero {
    --title-shadow-color: #6F1BC8;
    --title-shadow-color-dark: hsl(from var(--title-shadow-color) h s calc(l - 25) / 1);
    margin: 0;
    background-image: url('/images/hero-bg.jpg');
    /* background-image: linear-gradient(to bottom, hsl(263, 100%, 53%), hsl(327, 74%, 62%) 50%, hsl(32, 100%, 64%), hsl(56, 100%, 76%), hsl(56, 60%, 86%), hsl(56, 60%, 86%) 100%); */
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      background: linear-gradient(to bottom, rgb(255 255 255 / 0), rgb(255 255 255 / 1));
    }
    h1 {
      --title-translate-y: 12rem;
      --shadow-spacing: 1rem;
      font-family: 'Pixelify Sans', sans-serif;
      font-size: 12rem;
      line-height: 0.75;
      color: #FFEFFF;
      position: relative;
      z-index: 99999;
      translate: 0 var(--title-translate-y);
      opacity: 0;
      text-shadow: 
        0 0 calc(var(--shadow-spacing) * 0) #ffff84,
        calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0 var(--title-shadow-color),
        calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0 var(--title-shadow-color-dark);
      animation:
        slide-in 0.5s cubic-bezier(.28,1.96,.69,2.04) 0.5s forwards,
        animate-shadow 0.2s cubic-bezier(.28,1.96,.69,2.04) 1.25s forwards;
    }
    #hero-subtitle {
      font-family: 'Pixelify Sans', sans-serif;
      font-size: 2rem;
      color: #f57e24;
      margin-top: 1rem;
      span {
        display: inline-block;
        opacity: 0;
        translate: 0 1rem;
        animation: letter-in 0.3s ease-out forwards;
        animation-delay: calc(1.7s + var(--letter-index) * 0.05s);
      }
    }
  }

  @keyframes letter-in {
    to {
      opacity: 1;
      translate: 0 0;
    }
  }

  @keyframes slide-in {
    from {
      translate: 0 var(--title-translate-y);
      opacity: 1;
    }
    to {
      translate: 0 0;
      opacity: 1;
    }
  }
  
  @keyframes animate-shadow {
    from {
      text-shadow: 
        0 0 calc(var(--shadow-spacing) * 0) #ffff84,
        calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0 var(--title-shadow-color),
        calc(var(--shadow-spacing) * 0) calc(var(--shadow-spacing) * 0) 0 var(--title-shadow-color-dark);
    }
    to {
      text-shadow: 
        0 0 var(--shadow-spacing) #ffff84,
        calc(var(--shadow-spacing) * 0.5) calc(var(--shadow-spacing) * 0.5) 0 var(--title-shadow-color),
        var(--shadow-spacing) var(--shadow-spacing) 0 var(--title-shadow-color-dark);
    }
  }

  .button-wrapper {
    opacity: 0;
    translate: 0 1rem;
    animation: fade-up 0.5s ease-out 3s forwards;
  }

  @keyframes fade-up {
    to {
      opacity: 1;
      translate: 0 0;
    }
  }
</style>