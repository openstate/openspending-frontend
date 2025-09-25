<script lang="ts">
	import { page } from '$app/stores';
  $: session = $page.data.session;
  import OpenSpendingLogo from '$lib/assets/open-spending.svg';
	import { get } from 'svelte/store';
	import { api } from '../stores';
	import { onMount } from 'svelte';

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
  let adminRouteAdded = false

  $: if ((['admin'].includes(session.Role ?? '')) && !adminRouteAdded) {
    menuItems.push({route: '/beheer'})
    adminRouteAdded = true
  }

  let shortLink = ''

  const short = async(ev: Event) => {
    //spinner?
    const btn = (ev.currentTarget! as HTMLElement)
    btn.innerHTML = hourglassIcon
    getPopover()
    await fetch(get(api) + '/utils/short' + window.location.pathname)
      .then(async res => {
        shortLink = res.ok ? (await res.json()).url : window.location.toString()
        shortLinkPopover.show()
        btn.innerHTML = shareIcon
      })
      .catch(_e => {
        shortLink = window.location.toString()
        shortLinkPopover.show()
        btn.innerHTML = shareIcon
      })

  }
  
	const routeToTitle = (term: string): string => term.replace(/^\//, '').slice(0, 1).toLocaleUpperCase() + term.replace(/^\//, '').slice(1)

	$: current = menuItems.filter(menuItem => active(menuItem)).pop()

	$: getPagetitle = () => {
		const menuItem = current
		return menuItem === undefined 
			? ''// `Pagina "${$page.route.id}" niet gevonden`
			: menuItem.label ?? routeToTitle(menuItem.route)
	}

  const clipboardIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="shortlink-item bi bi-clipboard" viewBox="0 0 16 16">
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
  </svg>`
  const clipboardCheckedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
  </svg>`
  const hourglassIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hourglass-split" viewBox="0 0 16 16">
      <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
    </svg>`
  const shareIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
      <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
    </svg>`
  

  let bootstrap: typeof import('bootstrap') 
  let shortLinkPopover: bootstrap.Popover

  const getPopover = () => {
    if(!shareButton) return
    if (shortLinkPopover) shortLinkPopover.dispose()
    shortLinkPopover = new bootstrap.Popover(shareButton, {
      trigger: 'manual',
      sanitize: false,
      content: () => {
        return `
        <div class="input-group shortlink-item">
          <input type="text" class="shortlink-item form-control form-control-sm" id="shortlinkContent" value="${shortLink}">
          <button class="shortlink-item btn btn-sm btn-primary" id="clipboard">
            ${clipboardIcon}
          </button>
        </div>`
      },
    })
  }
  let shareButton: HTMLButtonElement

  onMount(async () => {
    shortLink = window.location.toString()
    bootstrap = await import('bootstrap')
    shareButton = document.getElementById('shareButton')! as HTMLButtonElement
    shareButton.addEventListener('shown.bs.popover', () => {
      const field = (document.getElementById('shortlinkContent')! as HTMLInputElement)
      field.setSelectionRange(0, shortLink.length);
      field.select()
      document.getElementById('clipboard')?.addEventListener('click', (ev) => {
        const btn = (ev.currentTarget as HTMLButtonElement)
        navigator.clipboard.writeText(shortLink)
          .then(_ => {
            btn.classList.add('btn-success')
            btn.classList.remove('btn-primary')
            btn.innerHTML = clipboardCheckedIcon
            setTimeout(() => shortLinkPopover.hide(), 250)
          })
          .catch(_ => {
            btn.classList.add('btn-danger')
            btn.classList.remove('btn-primary')
          })
      })
    })

    shareButton.addEventListener('inserted.bs.popover', () => {
      const handler = (ev: Event) => {
        if ((ev.target as HTMLElement).classList.contains('shortlink-item')) {
          return
        } else {
          shortLinkPopover.hide()
          ev.currentTarget?.removeEventListener('click', handler);
        }
      }
      for (const body of document.getElementsByTagName('body')) {
        body.addEventListener('click', handler)
      }
    })
  })

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
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Open Spending</h5>
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
      <button 
        id="shareButton"
        class="btn btn-outline-primary ms-2"
        on:click={short}
        data-bs-toggle="popover"
        data-bs-placement="bottom"
        data-bs-content="..."
        data-bs-html="true" 
      >{@html shareIcon}</button>
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
