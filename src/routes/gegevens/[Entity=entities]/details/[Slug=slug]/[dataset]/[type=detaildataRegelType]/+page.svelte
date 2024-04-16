
<script lang="ts">
	import { goto } from '$app/navigation';
	import Currency from '$lib/Currency.svelte';
	import { onMount } from 'svelte';
	// import { DashLg, PlusLg } from 'svelte-bootstrap-icons';
  const grootboekRegels = (kostenplaats: string) => data.regels.filter(regel => regel.Kostenplaats === kostenplaats)
  const kostenplaatsRegels = (grootboek: string) => data.regels.filter(regel => regel.Grootboek === grootboek)
  export let data
  const setType = (type: 'grootboek' | 'kostenplaats' | 'regels') => goto(`/gegevens/${data.params.Entity}/details/${data.params.Slug}/${data.params.dataset}/${type}`)

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
<h2 class="fs-4 mb-5">{data.dataset.Summary} <em><br>bron: {data.dataset.Title})</em></h2>
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
  {#each data.detaildata as detail}
    <tr 
    data-grootboek="G-{detail.Grootboek}" 
    data-kostenplaats="K-{detail.Kostenplaats}"
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
    {#each grootboekRegels(detail.Kostenplaats) as regel}
    <tr>
      <td></td>
      <td class="text-secondary">{regel.GrootboekOmschrijving}</td>
      <td class="text-end text-secondary"><Currency ammount={regel.Bedrag}/></td>
    </tr>
    {/each}
    {/if}
    {#if data.params.type==='grootboek'}
    {#each kostenplaatsRegels(detail.Grootboek) as regel}
    <tr>
      <td></td>
      <td class="text-secondary">{regel.KostenplaatsOmschrijving}</td>
      <td class="text-end text-secondary"><Currency ammount={regel.Bedrag}/></td>
    </tr>
    {/each}
    {/if}
  {/each}
  </tbody>
</table>
