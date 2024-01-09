<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	$: pageTitle =
		$page.url.pathname === '/'
			? 'Home'
			: menuItems.has($page.url.pathname)
				? menuItems.get($page.url.pathname)!.title ?? menuItems.get($page.url.pathname)!.label
				: 'Pagina niet gevonden';

	const menuItems: Map<string, { label: string; title?: string }> = new Map();
	menuItems.set('/over', { label: 'Over' });
	menuItems.set('/faq', { label: 'FAQ' });
  onMount(() => {
    const header = document.querySelector('header')
    window.onscroll = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        header?.classList.add('small')
      } else {
        header?.classList.remove('small')
      }
    }
    
  })
</script>
<style lang="scss">
  header {

    nav {
      border-bottom: solid var(--purple) 2px;
      box-shadow: 0 4px 8px 0 rgba(76, 33, 110, 0.1), 0 6px 20px 0 rgba(76, 33, 110, 0.09);
    }

    .nav-link {
      margin-right: 10px;
    }

    .nav-link.active, .nav-link:hover {
      border-top: rgba(76, 33, 110, 1) solid 1px;
      border-bottom: rgba(76, 33, 110, 1) solid 1px;
    }

    .nav-link {
      border-top: rgba(76, 33, 110, 0) solid 1px;
      border-bottom: rgba(76, 33, 110, 0) solid 1px;
    }

    .nav-link {
      margin-right: 10px;
    }

    .nav-link.active, .nav-link:hover {
      border-top: rgba(76, 33, 110, 1) solid 1px;
      border-bottom: rgba(76, 33, 110, 1) solid 1px;
    }

    .nav-link {
      border-top: rgba(76, 33, 110, 0) solid 1px;
      border-bottom: rgba(76, 33, 110, 0) solid 1px;
    }

    img {
      transition: 0.4s;
    }

    .navbar-brand img {
       width: 200px;
    }

    &.small {
      .navbar-brand img {
        width: 100px;
      }

    }
  }

  
</style>

<svelte:head>
	<title>Open Spending | {pageTitle}</title>
</svelte:head>

<header>
  <nav class="navbar navbar-expand-lg fixed-top bg-body-tertiary ">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img src="/images/openspending-logo.svg" alt="Open Spending Logo" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav me-auto mb-2 mb-lg-0">
          <a
            class={$page.url.pathname === '/' ? 'nav-link active' : 'nav-link'}
            aria-current="page"
            href="/">Home</a
          >
          {#each menuItems as menuItem}
            <a
              class={$page.url.pathname.startsWith(menuItem[0]) ? 'nav-link active' : 'nav-link'}
              href={menuItem[0]}
              aria-current={$page.url.pathname.startsWith(menuItem[0]) ? 'page' : undefined}
            >
              {menuItem[1].label}
            </a>
          {/each}
        </div>
        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Zoek&hellip;"
            aria-label="Zoek"
          />
          <button class="btn btn-outline-primary" type="submit">Zoek</button>
        </form>
      </div>
    </div>
  </nav>
</header>