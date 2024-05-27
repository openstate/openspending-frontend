<script lang="ts">
	import { page } from '$app/stores';
  import OpenSpendingLogo from '$lib/assets/open-spending.svg';

  type MenuItem = { route: string, label?: string }
	const menuItems:MenuItem[] = [
    {route: '/', label: 'Home' },
    // {route: '/gegevens' },
    {route: '/over' },
    {route: '/data' },
    {route: '/faq', label: 'FAQ' },
    {route: '/lijstenmaker' },
    {route: '/contact' },
  ];

	const routeToTitle = (term: string): string => term.replace(/^\//, '').slice(0, 1).toLocaleUpperCase() + term.replace(/^\//, '').slice(1)

	$: current = menuItems.filter(menuItem => active(menuItem)).pop()

	$: getPagetitle = () => {
		const menuItem = current
		return menuItem === undefined 
			? ''// `Pagina "${$page.route.id}" niet gevonden`
			: menuItem.label ?? routeToTitle(menuItem.route)
	}

	$: active = (menuItem: MenuItem): boolean => 
		$page.route.id === menuItem.route || ($page.route.id??'-').split('/', 2).join('/') === menuItem.route
      || (($page.route.id?.startsWith('/gegevens') ?? false) && menuItem.route === '/')
	
</script>

<svelte:head>
	<title>Open Spending | {getPagetitle()}</title>
	<meta property="og:title" content="Open Spending | {getPagetitle()}" />
</svelte:head>

<header>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <a class="navbar-brand me-auto" href="/">
        <img src="{OpenSpendingLogo}" width="120" alt="Logo Open Spending?">
      </a>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Waar is mijn stemlokaal?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-center flex-grow-1 pe-3">
					{#each menuItems as menuItem}
            <li class="nav-item">
              <a 
                class="nav-link mx-lg-2"
                class:active={active(menuItem)} 
                aria-current={active(menuItem) ? 'page' : undefined}
                href={menuItem.route}>{menuItem.label ?? routeToTitle(menuItem.route)}</a>
            </li>
					{/each}
          </ul>
        </div>
      </div>
      <form class="d-flex" role="search" action="/zoek">
        <input
          class="form-control me-2"
          type="search"
          name="q"
          id="zoekveld"
          placeholder="Zoek&hellip;"
          aria-label="Zoek"
        />
        <input type="hidden" name="zoekmethode" value="EN">
        <button class="btn btn-outline-primary" type="submit">Zoek</button>
      </form>
      <button class="navbar-toggler pe-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>
</header>

<style>

  .navbar {
    background-color: var(--white);
    height: 80px;
    margin: 20px;
    margin-top: 50px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: 0.5rem;
}

.navbar-brand {
    font-weight: 500;
    color: var(--primary-color);
    font-size: 24px;
}

.navbar-toggler {
    border: none;
    font-size: 1.25rem;
}

.navbar-toggler:focus,
.btn-close:focus {
    box-shadow: none;
    outline: none;
}

.nav-link,
.nav-link.active {
    color: var(--black);
    font-weight: 300;
    position: relative;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary-color);
}

/* @media (max-width: 991px) {
    .login-button {
        display: none;
    }
} */

@media(min-width: 991px) {
    .nav-link::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background-color: #015C6E;
        visibility: hidden;
        transition: 0.3s ease-in-out;
    }

    .nav-link:hover::before,
    .nav-link.active::before {
        width: 100%;
        visibility: visible;
    }
}

</style>

<!-- 
<header>
	<nav class="navbar navbar-expand-lg fixed-top">
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
					{#each menuItems as menuItem}
						<a
							class="nav-link"
							class:active={active(menuItem)}
							href={menuItem.route}
							aria-current={active(menuItem) ? 'page' : undefined}
						>
							{menuItem.label ?? routeToTitle(menuItem.route)}
						</a>
					{/each}
				</div>
				<form class="d-flex" role="search" action="/zoek">
					<input
						class="form-control me-2"
						type="search"
            name="q"
            id="zoekveld"
						placeholder="Zoek&hellip;"
						aria-label="Zoek"
					/>
          <input type="hidden" name="zoekmethode" value="EN">
					<button class="btn btn-outline-primary" type="submit">Zoek</button>
				</form>
			</div>
		</div>
	</nav>
</header>

<style lang="scss">
	header {
		nav {
			background-color: rgb(249, 247, 251);
			border-bottom: solid var(--purple) 2px;
			box-shadow:
				0 4px 8px 0 rgba(76, 33, 110, 0.1),
				0 6px 20px 0 rgba(76, 33, 110, 0.09);
		}

		.nav-link {
			margin-right: 10px;
			font-weight: 500;
			color: var(--purple);
		}

		.nav-link.active,
		.nav-link:hover {
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

		.nav-link.active,
		.nav-link:hover {
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
</style> -->
