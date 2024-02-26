<script lang="ts">
	import { goto } from '$app/navigation';
	import Currency from '$lib/Currency.svelte';
	import { ucfirst } from '$lib/utils';
	import type { BronData } from '../../../../../Types.js';
	import DataRow from '$lib/DataRow.svelte';
  export let data;

	$: baten = data.Bron.data.reduce((a, b) => a + (b.Baten??0), 0)
	$: lasten = data.Bron.data.reduce((a, b) => a + (b.Lasten??0), 0)

	let hideZero: boolean = true
	const getUrl = () => `/gegevens/${data.params.Entity}/${data.params.Slug}/${data.filter.year}/${data.filter.period}/${data.filter.soort}/per/${data.filter.groepering}/${data.open.join('|')}`
	const filter = (name: keyof typeof data.filter, value: string | number) => {
		data.filter[name] = value.toString()
		if(name === 'groepering') {
			data.open = []
		}
		goto(getUrl())
	}

	const toggleRow = async (row: BronData) => {
		if (data.open.includes(row.Code)) {
			data.open = data.open.filter(code => code !== row.Code)
		} else {
			data.open.push(row.Code)
		}
		goto(getUrl() + `#${row.Code}`)
		return
	}
</script>
<style>
</style>
<svelte:head>
	<title>{data.Bron.Title} | Open Spending</title>
	<meta property="og:title" content="{data.Bron.Title} | Open Spending" />
</svelte:head>

<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item"><a href="/gegevens">Gegevens</a></li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{data.params.Entity.replace('Regelingen', ' Regelingen')}
			  </a>
				<ul class="dropdown-menu">
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => goto('/gegevens/Provincies')}>Provincies</a></li>
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => goto('/gegevens/Gemeenten')}>Gemeenten</a></li>
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => goto('/gegevens/Waterschappen')}>Waterschappen</a></li>
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => goto('/gegevens/GemeenschappelijkeRegelingen')}>Gemeenschappelijke regelingen</a></li>
				</ul>
			</span>
		</li>
		<li class="breadcrumb-item" aria-current="page">{data.Bron.Title}</li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{data.Bron.dataset.Period}
			  </a>
				<ul class="dropdown-menu">
					{#each data.Bron.datasets as dataset}
						<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => filter('year', dataset.Period)}>{dataset.Period}</a></li>
					{/each}
				</ul>
			</span>
		</li>
		<li class="breadcrumb-item" aria-current="page">
			{#if data.Bron.dataset.verslagsoorten.length > 1}
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{ucfirst(data.filter.period)}
			  </a>
				<ul class="dropdown-menu">
					{#each data.Bron.dataset.verslagsoorten as verslagsoort}
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => filter('period', verslagsoort)}>{ucfirst(verslagsoort)}</a></li>
					{/each}
				</ul>
			</span>
			{:else}
				{data.Bron.dataset.verslagsoorten[0]}
			{/if}
		</li>
		<li class="breadcrumb-item" aria-current="page">per</li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{ucfirst(data.filter.groepering)}
			  </a>
				<ul class="dropdown-menu">
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => filter('groepering', 'categorie')}>Categorie</a></li>
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => filter('groepering', 'hoofdfunctie')}>Hoofdfunctie</a></li>
				</ul>
			</span>
		</li>
	</ol>
</nav>

<h1>{data.Bron.Title}</h1>
<div class="row">
	<div class="col-sm-12 col-lg-5">
		<table class="table">
			<thead>
				<tr>
					<th>Baten</th>
					<th>Lasten</th>
					<th>Standen</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><Currency ammount={data.Bron.dataset.totaal.Baten} multiplier={1000}/></td>
					<td><Currency ammount={data.Bron.dataset.totaal.Lasten} multiplier={1000}/></td>
					<td><Currency ammount={data.Bron.dataset.totaal.Standen} multiplier={1000}/></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
<p>
	<label class="form-check-label">
		<input class="form-check-input" type="checkbox" bind:checked={hideZero}/>
		verberg lege bedragen
	</label>
</p>
<div>
	<table class="table caption-top table-bordered">
  <caption class="fw-bold">
    {data.Bron.dataset.Summary} <em class="fs-6">(bedragen in <Currency ammount={1000}/>)</em>
	</caption>
		<thead>
			<tr>
				<th class="togglerow">&nbsp;</th>
				<th class="code">Code</th>
				<th>Titel</th>
				<th class="text-end">Baten</th>
				<th class="text-end">Lasten</th>
			</tr>
		</thead>
		<tbody>
		{#each data.Bron.data as row, i}
		<DataRow row={row} onClick={toggleRow} hideZero={hideZero} lastRow={i+1 === data.Bron.data.length }/>
		{/each}
		</tbody>
		<tfoot>
			<td></td>
			<td></td>
			<td></td>
			<th class="text-end"><Currency classes="text-white p-1 bg-success" ammount={baten} /></th>
			<th class="text-end"><Currency classes="text-white p-1 bg-danger" ammount={lasten} /></th>
		</tfoot>
	</table>
</div>

<h3>Data hulpmiddelen</h3>
<ul>
	<li><a href="{data.url}" target="_blank">Data API bron</a></li>
</ul>
