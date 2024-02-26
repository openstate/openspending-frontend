<script lang="ts">
	import { goto } from '$app/navigation';
	import { ucfirst } from '$lib/utils.js'
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import DataTable from '$lib/DataTable.svelte';
  export let data;
	let hideZero = true

	const ammount = (eur: number) => eur === 0 || !eur ? '-' : ('€ ' + eur.toLocaleString())
	const percentage = (eur: number, BL: 'Baten' | 'Lasten') => eur === 0 || !eur ? '-' : (Math.round(10000 * eur / data.Bron.totaal[BL].PL2)/100) + '%'

	const getUrl = () => `/gegevens/${data.params.Entity}/${data.params.Slug}/${data.filter.year}/${data.filter.period}/${data.filter.soort}/per/${data.filter.groepering}`
	const filter = (name: keyof typeof data.filter, value: string | number) => {
		data.filter[name] = value.toString()
		goto(getUrl())
	}
	const api = import.meta.env.PROD ? 'https://data.openspending.nl' : 'http://localhost:3000'
	onMount(async () => {
		const url = `${api}/bronnen/${data.params.Entity}/${data.params.Slug}/trends`
		let trends: Array<{Period: number, totaal: number}> = (await fetch(url).then(r => r.json())).trends
		trends = trends.filter(row => row.totaal !== 0)
		new Chart(
			document.getElementById('begroting-per-jaar')! as HTMLCanvasElement,
			{
				type: 'bar',
				options: {
					backgroundColor: 'rgba(97, 168, 169, 0.7)'
				},
				data: {
					labels: trends.map(row => row.Period),
					datasets: [
						{
							label: 'Begroting per jaar (in €1.000)',
							data: trends.map(row => row.totaal)
						},
						{
							label: 'Peiljaar (in €1.000)',
							data: trends.map(_ => data.Bron.totaal.Baten.PL2),
							backgroundColor: 'rgba(76, 33, 110, 0.7)'
						}
					]
				}
			}
		)
		const peilJaar = data.Bron.dataset.Period
		const peilBegrotingBedrag = data.Bron.totaal.Baten.PL2
		const deltas: Array<{Period: number, delta: number}> = trends.map(row => {
			return {
				Period: row.Period,
				delta: Math.round(10000 * ((row.totaal - peilBegrotingBedrag) / peilBegrotingBedrag))/100
			}
		})
		new Chart(
			document.getElementById('trends')! as HTMLCanvasElement,
			{
				type: 'bar',
				options: {
					backgroundColor: (bar) => {
						return (bar.raw as number) > 0 ? 'rgba(97, 168, 169, 0.7)' : 'rgba(76, 33, 110, 0.7)'
					}
				},
				data: {
					labels: trends.filter(row => row.Period !== peilJaar).map(row => row.Period),
					datasets: [
						{
							label: `Verschil met peiljaar ${peilJaar}`,
							data: deltas.filter(row => row.Period !== peilJaar).map(row => row.delta)
						}
					]
				}
			}
		)
	})

	const csv = () => {
		const rows: Array<Array<number| string>> = [['Soort', 'Titel', 'Bedrag', 'Percentage']]
		data.Bron.Baten.filter(row => row.PL2 || !hideZero).map(row => rows.push(['Baten', row.Title, row.PL2, percentage(row.PL2, 'Baten')]))
		data.Bron.Lasten.filter(row => row.PL2 || !hideZero).map(row => rows.push(['Lasten', row.Title, row.PL2, percentage(row.PL2, 'Lasten')]))
		const csvRows = rows.map(row => row.join(',')).join('\n')
		const blob = new Blob([csvRows], { type: 'text/csv' })
		const a = document.createElement('a')
		a.setAttribute('href', window.URL.createObjectURL(blob) ) 
		a.setAttribute('download', `${data.Bron.Slug}-${data.Bron.dataset.Period}-${data.filter.groepering}.csv`);
		a.click()
	}

</script>
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
<p class="lead">{data.Bron.dataset.Summary}</p>
<p>
	<label class="form-check-label">
		<input class="form-check-input" type="checkbox" bind:checked={hideZero} />
		verberg lege bedragen
	</label>
</p>

<div class="container p-0 m-0">
	<div class="row">
		<div class="col-lg-6 col-sm-12">
			<DataTable bron={data.Bron} baten={true} hideZero={hideZero} titleLabel={data.filter.groepering === 'hoofdfunctie' ? 'Functie' : 'Categorie'}/>
		</div>
		<div class="col-lg-6 col-sm-12">
			<DataTable bron={data.Bron} baten={false} hideZero={hideZero} titleLabel={data.filter.groepering === 'hoofdfunctie' ? 'Functie' : 'Categorie'}/>
		</div>
	</div>
</div>
<div class="container p-0 m-0">
	<h3>Trends</h3>
	<div class="row">
		<div class="col-lg-6 col-sm-12">
			<div style="width: 100%;"><canvas id="begroting-per-jaar"></canvas></div>
		</div>
		<div class="col-lg-6 col-sm-12">
			<div style="width: 100%;"><canvas id="trends"></canvas></div>
		</div>
	</div>
</div>
<h3>Data gereedschappen</h3>
<ul>
	<li>
		<a href="{'#'}'" on:click|preventDefault={csv}>Download de tabeldata als CSV &raquo;</a>
	</li>
	<li>
		<a href="{data.url}" target="_blank">Bekijk de brondata in onze API &raquo;</a>
	</li>
	<li>
		<a href="{data.Bron.dataset.StatLine}" target="_blank">Bekijk de IV3 data in StatLine van CBS &raquo;</a>
	</li>
</ul>
