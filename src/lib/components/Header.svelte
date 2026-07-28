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
			<img src={favicon} alt="Logo" />
		</a>
		<ul>
			<li><a href="/">home</a></li>
			<li><a href="/about">about</a></li>
			<li><a href="/contact">contact</a></li>
		</ul>
	</nav>
</header>

<style>
	header {
    --blur: 12px;
    nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      backdrop-filter: blur(var(--blur));
      -webkit-backdrop-filter: blur(var(--blur));
      background-color: color-mix(in srgb, var(--primary) 80%, transparent);
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    &.hidden > nav {
      transform: translateY(-100%);
    }
    .logo {
      display: flex;
      align-items: center;
      img {
        height: 40px;
        width: 40px;
      }
    }
	}



	nav {
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
        color: var(--background);
        font-weight: bold;
        transition: color 0.3s;
        &:hover {
          color: var(--accent);
        }
      }
    }
	}
</style>