<script lang="ts">
	import { page } from '$app/stores';

  const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://host.docker.internal:3000'
    
  const url = new URL($page.url)
  const path = url.pathname.split('/').filter(p => p)
  let bron: Bron | undefined
  let entity = 'Gemeenten'

	import { onMount } from 'svelte';
	import type { Bron } from '../Types';
	import { goto } from '$app/navigation';
  let showError = false
  onMount(async () => {
    let slug = path.shift()
    if (slug) {
      if (slug.startsWith('provincie-')) {
        entity = 'Provincies'
        slug = slug.replace('provincie-', '') + '-pv'
      }
      bron = await  fetch(`${api}/bronnen/${entity}/${slug}`)
        .then(async res => {
          if (res.status === 404 && entity === 'Gemeenten') {
            entity = 'GemeenschappelijkeRegelingen'
            return await fetch(`${api}/bronnen/${entity}/${slug}`)
              .then(async res => {
                if (res.ok) return await res.json()
              })
              .catch(e => {})
          } else if (res.ok) {
            return await res.json()
          }
        })
        .catch(e => {})
    }
    if (bron) {
      let url = `/gegevens/${entity}/${slug}`
      const verslagsoort = path.shift()
      const periode = path.shift()
      const groepering = path.pop() === 'categorieen' ? 'categorie' : 'hoofdfunctie'
      if (periode) {
        if (periode.match(/^\d{4}$/)) {
          url = `/gegevens/${entity}/per/${groepering}/${slug}/${periode}/${verslagsoort}`
        } else if (periode.match(/^\d{4}\-0$/)) {
          url = `/gegevens/${entity}/per/${groepering}/${slug}/${periode}/begroting`
        } else if (periode.match(/^\d{4}\-[1-4]$/)) {
          url = `/gegevens/${entity}/per/${groepering}/${slug}/${periode.replace(/-[1-4]$/, '')}/Q${periode.replace(/^\d{4}\-/, '')}`
        }
      }
      goto(url)
    } else {
      showError = true
    }
  })
</script>
<div class="modal fade modal-fullscreen" data-bs-backdrop="static" data-bs-keyboard="false" id="loading">
	<div class="modal-dialog">
		<div class="d-flex justify-content-center" style="margin-top: 400px;">
			<div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status">
				<span class="visually-hidden">Een moment geduld a.u.b.</span>
			</div>
		</div>
	</div>
</div>

{#if $page.status === 404}
  {#if showError}
  <h1>Pagina niet gevonden</h1>
  <div class="row">
    <div class="col col-sm-12 col-lg-9 col-md-12">
      <p class="lead">
        Zoals je kunt zien is Open Spending vernieuwd. Het kan daarom zijn dat oude webadressen en/of bookmarks niet meer werken.
        We raden je aan om via de navigatie in het menu opnieuw  de gegevens te vinden die je zoekt en je eventuele bookmarks aan te passen.
      </p>
      <p class="lead">
        Onze excuses voor het ongemak!
      </p>
    </div>
  </div>
  {:else}
  <h1>Een moment geduld a.u.b.</h1>
  <div class="row">
    <div class="col col-sm-12 col-lg-9 col-md-12">
      <p class="lead">
        Zoals je kunt zien is Open Spending vernieuwd. Het kan daarom zijn dat oude webadressen en/of bookmarks niet meer werken.
        We proberen je nu om te leiden naar de juiste URL.
      </p>
    </div>
  </div>
  {/if}
{:else}
<h1>Er is een fout opgetreden</h1>
<p class="lead">Er is helaas iets fout gegaan, probeert u het later nogmaals.</p>
<div class="alert alert-warning" role="alert">
  <code>{$page.status}: {$page.error?.message}</code>
</div>
{/if}
