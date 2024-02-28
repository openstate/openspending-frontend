<script lang="ts">
	import { goto } from '$app/navigation';
	import Currency from '$lib/Currency.svelte';
	import { ucfirst } from '$lib/utils';
	import type { BronData } from '../../../../../Types.js';
	import DataRow from '$lib/DataRow.svelte';
	import { XSquareFill } from 'svelte-bootstrap-icons';
	import { onMount } from 'svelte';
	import { api } from '../../../../../stores.js'
	import Chart from 'chart.js/auto';

  export let data;

	$: baten = Bron.data.reduce((a, b) => a + (b.Baten??0), 0)
	$: lasten = Bron.data.reduce((a, b) => a + (b.Lasten??0), 0)

	let hideZero: boolean = true
	const getUrl = () => data.slugs.length === 0 ? `/gegevens/${data.params.Entity}` : `/gegevens/${data.params.Entity}/${data.slugs.join('|')}/${data.filter.year}/${data.filter.period}/${data.filter.soort}/per/${data.filter.groepering}/${data.open.join('|')}`
	const filter = (name: keyof typeof data.filter, value: string | number) => {
		data.filter[name] = value.toString()
		if(name === 'groepering') {
			data.open = []
		}
		findSource.value=''
		goto(getUrl())
	}

	let findSource: HTMLInputElement

	const toggleRow = async (row: BronData) => {
		if (data.open.includes(row.Code)) {
			data.open = data.open.filter(code => code !== row.Code)
		} else {
			data.open.push(row.Code)
		}
		goto(getUrl() + `#${row.Code}`)
		return
	}

  onMount(async () => {
    const {Autocomplete} = await import('$lib/autocomplete');
    const onSelectItem = async (arg: {label: string, value: string, field: any}) => {
      let [_, Slug] = (arg.value as string).split('|')
			data.slugs.push(Slug)
			goto(getUrl())
    }
    fetch(`${$api}/utils/bronnen/${data.params.Entity}/${data.bronnen[0].dataset.Period}`)
      .then(res => res.json())
			.then(d => d as Array<{Type: string, Slug: string, label: string, entiteit: string, value: string}>)
      .then((bronnen) => {
        const opts = { data: bronnen.filter(bron => !data.slugs.includes(bron.Slug)), threshold: 1, maximumItems: 10, onSelectItem, showEntity: false}
        new Autocomplete(document.getElementById('find-source'), opts)
      })
		

		const peilBegrotingBedrag = data.bronnen[0].dataset.totaal.Baten ?? 1
		const deltas = (slug: string): Array<{Period: number, delta: number}> => data.trends[slug].
			map(row => {
				return {
					Period: row.Period,
					delta: Math.round(10000 * ((row.totaal - peilBegrotingBedrag) / peilBegrotingBedrag))/100
				}
			})
		const datasets = []

		for (const slug of data.slugs) {
			datasets.push(
				{
					label: `${data.sourcenames[slug]}`,
					data: deltas(slug).filter(row => row.Period.toString() !== data.filter.year.toString()).map(row => row.delta)
				}
			)
		}
		new Chart(
			document.getElementById('trends')! as HTMLCanvasElement,
			{ type: 'bar', data: {
					labels: data.trends[data.slugs[0]].filter(row => row.Period.toString() !== data.filter.year.toString()).map(row => row.Period),
					datasets
				}
			}
		)

		datasets.length = 0
		for (const slug of data.slugs) {
			datasets.push(
				{
					label: `${data.sourcenames[slug]}`,
					data: data.trends[slug].map(r => r.totaal)
				}
			)
		}
		new Chart(
			document.getElementById('begroting-per-jaar')! as HTMLCanvasElement,
			{ type: 'bar', data: {
					labels: data.trends[data.slugs[0]].map(row => row.Period),
					datasets
				}
			}
		)

  })
	$: Bron = data.bronnen[0]
	$: titles = data.bronnen.length === 1 ? data.bronnen[0].Title : data.bronnen.map((bron, i) => ((i+1 === data.bronnen.length ? ' en ' : (i===0?'':', ')) + bron.Title)).join('')
</script>
<style>
	.hidden { display: none;}
</style>
<svelte:head>
	<title>{titles} | Open Spending</title>
	<meta property="og:title" content="{titles} | Open Spending" />
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
		<li class="breadcrumb-item" aria-current="page">{titles}</li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{Bron.dataset.Period}
			  </a>
				<ul class="dropdown-menu">
					{#each Bron.datasets as dataset}
						<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => filter('year', dataset.Period)}>{dataset.Period}</a></li>
					{/each}
				</ul>
			</span>
		</li>
		<li class="breadcrumb-item" aria-current="page">
			{#if Bron.dataset.verslagsoorten.length > 1}
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{ucfirst(data.filter.period)}
			  </a>
				<ul class="dropdown-menu">
					{#each Bron.dataset.verslagsoorten as verslagsoort}
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => filter('period', verslagsoort)}>{ucfirst(verslagsoort)}</a></li>
					{/each}
				</ul>
			</span>
			{:else}
				{Bron.dataset.verslagsoorten[0]}
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

<h1>{titles}</h1>
<h2 class="fs-4 mb-5">{Bron.dataset.Summary} <br><em class="fs-6">(bedragen in € 1.000)</em></h2>

<div class="row mb-5">
	<div class="col-sm-12 col-m-12 col-lg-6">
		<table class="table">
			<thead>
				<tr>
					<td></td>
					<td></td>
					<th class="text-end">Baten</th>
					<th class="text-end">Lasten</th>
					<th class="text-end">Standen</th>
				</tr>
			</thead>
			<tbody>
				{#each data.bronnen as bron, i}
				<tr>
					<th scope="row" style="width:1px;">
						<a href="{'#'}" style="margin-right: 5px" on:click={() => {data.slugs = data.slugs.filter(slug => slug !== bron.Slug); goto(getUrl())}}><XSquareFill/></a>
					</th>
					<th scope="row">
						{bron.Title}
					</th>
					<td class="text-end" style="white-space: nowrap;"><Currency ammount={bron.dataset.totaal.Baten} multiplier={1000}/></td>
					<td class="text-end" style="white-space: nowrap;"><Currency ammount={bron.dataset.totaal.Lasten} multiplier={1000}/></td>
					<td class="text-end" style="white-space: nowrap;"><Currency ammount={bron.dataset.totaal.Standen} multiplier={1000}/></td>
				</tr>
				{/each}
			</tbody>
		</table>
		<div class="input-group mt-2"
			class:hidden={data.bronnen.length >= 3}
		>
			<input id="find-source" bind:this={findSource} aria-label="Zoek" class="form-control" type="text" size="20" placeholder="voeg vergelijkende bron toe &hellip;">
			<span class="input-group-text"><kbd>/</kbd></span>
		</div>
	</div>
</div>
<div>
	<table class="table caption-top table-bordered">
  <caption>
	<p>
		<label class="form-check-label">
			<input class="form-check-input" type="checkbox" bind:checked={hideZero}/>
			verberg lege bedragen
		</label>
	</p>
	</caption>
		<thead>
			<tr>
				<th class="togglerow">&nbsp;</th>
				<th class="code">Code</th>
				<th>Titel</th>
				<th class="text-center" colspan="{data.bronnen.length}">Baten</th>
				<th class="text-center" colspan="{data.bronnen.length}">Lasten</th>
			</tr>
			{#if data.bronnen.length > 1}
			<tr>
				<th class="togglerow">&nbsp;</th>
				<th class="code">&nbsp;</th>
				<th>&nbsp;</th>
				{#each data.bronnen as bron}
				<th class="text-end" >{bron.Title}</th>
				{/each}
				{#each data.bronnen as bron}
				<th class="text-end" >{bron.Title}</th>
				{/each}
			</tr>
			{/if}
		</thead>
		<tbody>
		{#each Bron.data as row, i}
		<DataRow 
			row={row}
			onClick={toggleRow}
			hideZero={hideZero}
			lastRow={i+1 === Bron.data.length }
			rowNumber_level1={i}
			bronnen={data.bronnen}/>
		{/each}
		</tbody>
		<tfoot>
			<td></td>
			<td></td>
			<td></td>
			<th colspan="{data.bronnen.length}" class="text-end"><Currency classes="text-white p-1 bg-success" ammount={baten} /></th>
			<th colspan="{data.bronnen.length}" class="text-end"><Currency classes="text-white p-1 bg-danger" ammount={lasten} /></th>
		</tfoot>
	</table>
</div>
<div class="row">
	<div class="col-sm-12 col-lg-6">
		<h3 class="fs-4">Begroting per jaar</h3>
		<div style="width: 100%; height: 500px;"><canvas id="begroting-per-jaar"></canvas></div>
	</div>
	<div class="col-sm-12 col-lg-6">
		<h3 class="fs-4">Verschil met peiljaar {data.filter.year}</h3>
		<div style="width: 100%; height: 500px;"><canvas id="trends"></canvas></div>
	</div>
</div>

<h3>Data hulpmiddelen</h3>
