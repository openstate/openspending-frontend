
<script lang="ts">
	import { goto } from '$app/navigation';
	import Currency from '$lib/Currency.svelte';
	// import { DashLg, PlusLg } from 'svelte-bootstrap-icons';
  const grootboekRegels = (kostenplaats: string) => data.regels.filter(regel => regel.Kostenplaats === kostenplaats)
  const kostenplaatsRegels = (grootboek: string) => data.regels.filter(regel => regel.Grootboek === grootboek)
  export let data
  const setType = (type: 'grootboek' | 'kostenplaats' | 'regels') => goto(`/gegevens/${data.params.Entity}/details/${data.params.Slug}/${data.params.dataset}/${type}`)
</script>
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
    <tr>
      {#if data.params.type==='regels' || data.params.type==='grootboek'}
      <td>{detail.Grootboek}</td>
      <td>{detail.GrootboekOmschrijving}</td>
      {/if}
      {#if data.params.type==='regels' || data.params.type==='kostenplaats'}
      <td>{detail.Kostenplaats}</td>
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
