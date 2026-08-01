<script lang="ts">
 	import favicon from '$lib/assets/favicon.svg';

	interface Props {
		flgIsHidden: boolean;
	}

	let { flgIsHidden }: Props = $props();
</script>

<header	class:hidden={flgIsHidden} >
	<nav>
		<a href="/" class="logo">
			<!-- <img src={favicon} alt="Logo" /> -->
       ca
		</a>
		<ul>
			<li><a href="#content">home</a></li>
			<li><a href="#about">about</a></li>
			<li><a href="#experience">experience</a></li>
			<li><a href="#contact">contact</a></li>
		</ul>
	</nav>
</header>

<style>
	header {
    --blur: 12px;
    font-family: 'Pixelify Sans', sans-serif;
    nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      background-color: rgb(from var(--primary) r g b / 0.2);
      --webkit-backdrop-filter: blur(var(--blur));
      backdrop-filter: blur(var(--blur));
      box-shadow: 0 0 10px rgb(from var(--primary-dark) r g b / 0.5);
      transform: translateY(0);
      transition: transform 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      ul {
        display: flex;
        list-style: none;
        gap: 1rem;
        a {
          text-decoration: none;
          color: var(--text);
          font-weight: 700;
          font-size: 1.25rem;
          transition: color 0.3s;
          text-shadow: 0 0 0px hsl(from var(--secondary) h s calc(l + 30) / 1);
          transition: all 0.3s ease;
          &:hover {
            color: var(--secondary);
            text-shadow: 0 0 16px hsl(from var(--secondary) h s calc(l + 30) / 1);
          }
        }
      }
    }
    &.hidden > nav {
      transform: translateY(-100%);
    }
    .logo {
      --shadow-spacing: 0.5rem;
      font-family: 'Pixelify Sans', sans-serif;
      font-size: 3rem;
      font-weight: 900;
      line-height: 1;
      text-shadow:
        0 0 var(--shadow-spacing) #ffff84,
        calc(var(--shadow-spacing) * 0.5) calc(var(--shadow-spacing) * 0.5) 0 var(--title-shadow-color),
        var(--shadow-spacing) var(--shadow-spacing) 0 var(--title-shadow-color-dark);
      text-decoration: none;
      color: var(--text);
      display: flex;
      align-items: center;
    }
	}
</style>