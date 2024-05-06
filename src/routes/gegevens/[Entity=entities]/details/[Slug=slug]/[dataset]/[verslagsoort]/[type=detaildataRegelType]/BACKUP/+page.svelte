
<script lang="ts">
	import { goto } from '$app/navigation';
	import Currency from '$lib/Currency.svelte';
	import { onMount } from 'svelte';
	// import { DashSquareFill, PlusSquare, PlusSquareFill, Square } from 'svelte-bootstrap-icons';
  const grootboekRegels = (categorie: string, kostenplaats: string) => data.regels[categorie].filter(regel => regel.Kostenplaats === kostenplaats)
  const kostenplaatsRegels = (categorie: string, grootboek: string) => data.regels[categorie].filter(regel => regel.Grootboek === grootboek)
  export let data
  const setType = (type: 'grootboek' | 'kostenplaats' | 'regels') => goto(`/gegevens/${data.params.Entity}/details/${data.params.Slug}/${data.params.dataset}/${data.params.verslagsoort}/${type}`)

  const categoryID = (category: string) => parseInt(category.split('|')[0])
  const categoryOmschrijving = (category: string) => category.split('|')[1]

  onMount(() => {
    if (document.location.hash) {
      window.scroll()
      const id = document.location.hash.replace(/^#/, '')
      const row = id.startsWith('G-')
        ? document.querySelector(`[data-grootboek="${id}"]`)
        : document.querySelector(`[data-kostenplaats="${id}"]`)
      if (row) {
        row.classList.add('highlight')
        setTimeout(() => {
          row.classList.remove('highlight')
          row.classList.add('no-highlight')
          row.classList.add('table-active')
        }, 500)

      }
    }
  })
</script>
<style>

:global(tr.highlight, tr.highlight td) {
  transition-property: background-color color;
  transition-timing-function: ease-in-out;
  background-color: var(--magenta);
  color: White;
  transition-duration: 0.5s;
}

:global(tr.no-highlight, tr.no-highlight td) {
  transition-property: background-color color;
  transition-timing-function: ease-in-out;
  background-color: inherit;
  color: inherit;
  transition-duration: 0.5s;
}

</style>
<svelte:head>
	<title>Detaildata {data.bron.Title} | Open Spending</title>
	<meta property="og:title" content="Detaildata {data.bron.Title}} | Open Spending" />
</svelte:head>
<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{data.params.Entity.replace('Regelingen', ' Regelingen')}
			  </a>
				<ul class="dropdown-menu">
					<li><a class="dropdown-item" href="/gegevens/Provincies">Provincies</a></li>
					<li><a class="dropdown-item" href="/gegevens/Gemeenten">Gemeenten</a></li>
					<li><a class="dropdown-item" href="/gegevens/GemeenschappelijkeRegelingen">Gemeenschappelijke regelingen</a></li>
				</ul>
			</span>
		</li>
		<li class="breadcrumb-item" aria-current="page"><a href="/gegevens/{data.params.Entity}/{data.bron.Slug}">{data.bron.Title}</a></li>
		<li class="breadcrumb-item" aria-current="page">detaildata</li>
	</ol>
</nav>


<h1>Detaildata {data.bron.Title}</h1>
<div class="mb-5">
  <h2 class="fs-4">{data.dataset.Summary} <em><br>bron: {data.dataset.Title})</em></h2>
  <p><small><a href="/gegevens/detaildata">klik hier om meer organisaties met detaildata te bekijken &hellip;</a></small></p>
</div>

<div class="row">
  <div class="col-12">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link disabled" aria-disabled="true" href="{'#'}">Toon gegevens:</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" class:active={data.params.type === 'grootboek'} on:click={() => setType('grootboek')} href={'#'}>Grootboek</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" class:active={data.params.type === 'kostenplaats'} on:click={() => setType('kostenplaats')} href={'#'}>Kostenplaats</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" class:active={data.params.type === 'regels'} on:click={() => setType('regels')} href={'#'}>Alles</a>
      </li>
    </ul>
  </div>
</div>
<table class="table table-hover caption-top table-bordered">
  <thead>
    <tr>
      {#if data.params.type==='regels' || data.params.type==='grootboek'}<th colspan="2">Grootboek</th>{/if}
      {#if data.params.type==='regels' || data.params.type==='kostenplaats'}<th colspan="2">Kostenplaats</th>{/if}
      <th>Bedrag</th>
    </tr>
  </thead>
  <tbody>
    {#each Object.keys(data.detaildata) as category}
    <tr data-category-id="{categoryID(category)}">
      <td></td>
      {#if data.params.type==='regels'}
      <th colspan="3"><h3 class="fs-5">{categoryOmschrijving(category)}</h3></th>
      {:else}
      <th><h3 class="fs-5">{categoryOmschrijving(category)}</h3></th>
      {/if}
      <td></td>
    </tr>
      {#each data.detaildata[category] as detail}
        <tr 
        data-grootboek="G-{detail.Grootboek}" 
        data-kostenplaats="K-{detail.Kostenplaats}"
        data-category="{detail.CategorieID}"
        >
          {#if data.params.type==='regels' || data.params.type==='grootboek'}
          <td>
            {detail.Grootboek}
            <div style="position: relative; top: -120px;" id="G-{detail.Grootboek}"></div>
          </td>
          <td>{detail.GrootboekOmschrijving}</td>
          {/if}
          {#if data.params.type==='regels' || data.params.type==='kostenplaats'}
          <td>{detail.Kostenplaats} 
            <div style="position: relative; top: -120px;" id="K-{detail.Kostenplaats}"></div>
          </td>
          <td>{detail.KostenplaatsOmschrijving}</td>
          {/if}
          <td class="text-end fw-bold"><Currency ammount={detail.Bedrag}/></td>
        </tr>
        {#if data.params.type==='kostenplaats'}
        {#each grootboekRegels(category, detail.Kostenplaats) as regel}
        <tr>
          <td></td>
          <td class="text-secondary">{regel.Grootboek} | {regel.GrootboekOmschrijving}</td>
          <td class="text-end text-secondary"><Currency ammount={regel.Bedrag}/></td>
        </tr>
        {/each}
        {/if}
        {#if data.params.type==='grootboek'}
        {#each kostenplaatsRegels(category, detail.Grootboek) as regel}
        <tr>
          <td></td>
          <td class="text-secondary">{regel.Kostenplaats} | {regel.KostenplaatsOmschrijving}</td>
          <td class="text-end text-secondary"><Currency ammount={regel.Bedrag}/></td>
        </tr>
        {/each}
        {/if}
      {/each}
    {/each}
  </tbody>
</table>
