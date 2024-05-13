<script lang="ts">
	import { goto } from '$app/navigation';
	import Currency from '$lib/Currency.svelte';
	import { ucfirst } from '$lib/utils';
	import type { BronData, BronDetail, DataSet, SingleDataSet, Verslagsoort } from '../../../../../Types.js';
	import DataRow from '$lib/DataRow.svelte';
	import { XSquareFill, FileEarmarkSpreadsheet } from 'svelte-bootstrap-icons';
	import { onMount } from 'svelte';
	import { api } from '../../../../../stores.js'
  import { get } from 'svelte/store'

  import { isLive } from '$lib/utils.js';
  import { page } from '$app/stores';

  export let data;
  
	let hideZero: boolean = true
	const slugs = () => data.requested.map(bron => bron.Slug)
	const slugsUrl = () => data.requested.map(bron => [bron.Slug, bron.Period, bron.Verslagsoort].join('/')).join('/')
	$: titles = data.bronnen.length === 1 ? (data.params.Entity === 'GemeenschappelijkeRegelingen' ? data.bronnen[0].Description : data.bronnen[0].Title) : data.bronnen.map((bron, i) => ((i+1 === data.bronnen.length ? ' en ' : (i===0?'':', ')) + (data.params.Entity === 'GemeenschappelijkeRegelingen' ? bron.Description :bron.Title))).join('')
	$: Bron = data.bronnen[0]
	let loader: bootstrap.Modal;
	const go = async (showLoader: boolean = true, updateCharts: boolean = true) => {
		const url = slugs().length === 0 ? `/gegevens/${data.params.Entity}` : `/gegevens/${data.params.Entity}/per/${data.groepering}/${slugsUrl()}${data.open.length === 0 ? '' : `/open/${data.open.join('|')}`}`
		const opts = {keepFocus: true, noScroll: true}
		if (showLoader) {
			document.getElementById('loading')!.addEventListener('shown.bs.modal', async _ => {
				return await goto(url, opts)
          .then(_ => {if (updateCharts) charts()})
					.then(_ => loader.hide())
			})
			loader.show()
		} else {
			return await goto(url, opts).then(_ => {if (updateCharts) charts()})
		}
	}

	const verwijderBron = async (bron: BronDetail) => {
		data.requested = data.requested.filter(b => `${b.Period}/${b.Slug}/${b.Verslagsoort}` !== `${bron.dataset.Period}/${bron.Slug}/${bron.Verslagsoort}`)
		return await go()
	}

  const isThereAnyDetaildataAvaliable = () =>  isLive($page.url.hostname) ? false :  Object.values(data.datasetsWithDetaildata).filter(o => o.length>0).length > 0

  // const datasetHasDetails = (bron: DataSet) => {
  //   bron.dataset.Period
  //   bron.Slug
  //   const detailData = data.datasetsWithDetaildata[bron.Slug]
  //     .filter(d => {
  //       console.log(d.Period, bron.dataset.Period)
  //       return d.Period === bron.dataset.Period
  //     })
  //   if (detailData.length > 0) {
  //     console.log(detailData)
  //   }
  //   return true
  // }
  

	const setPeriode = async (bron: BronDetail, periode: string) => {
    const item = data.requested
      .filter(b => `${b.Period}/${b.Slug}/${b.Verslagsoort}` === `${bron.dataset.Period}/${bron.Slug}/${bron.Verslagsoort}`)
      .shift()
    if (item) {
      item.Period = parseInt(periode)
      item.Verslagsoort = 'begroting'
    }
		return await go()
	}

	const setVerslagsoort = async (bron: BronDetail, verslagsoort: string) => {
		const item = data.requested
      .filter(b => `${b.Period}/${b.Slug}/${b.Verslagsoort}` === `${bron.dataset.Period}/${bron.Slug}/${bron.Verslagsoort}`)
      .shift()
    if (item) {
      item.Verslagsoort = verslagsoort as Verslagsoort
    }
		return await go()
	}

	let findSource: HTMLInputElement

	const toggleRow = async (ev: MouseEvent, row: BronData) => {
		if (data.open.includes(row.Code)) {
			data.open = data.open.filter(code => code !== row.Code)
		} else {
			data.open.push(row.Code)
		}
		return await go(false, false)
	}

  let metric: undefined | 'Bevolking' | 'Huishouden' | 'Oppervlakte'

  const normalize = (ammount: number | null | undefined, bron: BronDetail) => {
    if (typeof ammount !== 'number') return ammount
    if (metric !== undefined && bron.metrics && bron.metrics[metric]) {
      return Math.round(100 * 1000 * ammount / bron.metrics[metric]) / 100 ;
    } else {
      return ammount
    }
  }

  const getMetricsText = (bron: BronDetail, asHTML: boolean = true) => {
    if (metric === undefined || bron.metrics === undefined) return 
    if (!bron.metrics[metric]) {
      return asHTML 
        ? `<small class="text-body-tertiary"><em>${metric}</em><br>niet beschikbaar</small>`
        : ''
    }
    let cat = ''
    switch (metric) {
      case 'Bevolking': cat='inwoner'; break;
      case 'Huishouden': cat='huishouden'; break;
      case 'Oppervlakte': cat=asHTML ? 'm<sup>2</sup>' : 'm2'; break;
    }
    return asHTML 
      ? 'per ' + cat + ' ' + '<br>(' + bron.metrics[metric].toLocaleString() + ')'
      : 'per ' + cat + ' (tot. ' + bron.metrics[metric].toLocaleString() + ')'
  }

	const bronTypes: Map<string, string> = new Map([
		['Gemeenten', 'gemeente'],
		['GemeenschappelijkeRegelingen', 'gemeenschapelijke regeling'],
		['Waterschappen', 'waterschap'],
		['Provincies', 'provincie']
	])

	$: brontype = bronTypes.get(data.bronnen[0].Type) ?? 'bron'

	const charts = async() => {
		const dataset1: any = []
		const labels: number[] = []
		const dataset2: any = []
		const chart1 = document.getElementById('chart1')! as HTMLCanvasElement
		const chart2 = document.getElementById('chart2')! as HTMLCanvasElement
		const {Chart} = await import("chart.js/auto");
		Chart.getChart('chart1')?.destroy()
		Chart.getChart('chart2')?.destroy()
    let i = -1
		for (const b of data.requested) {
      i = i + 1
			const bron = data.bronnen.filter(bron => `${b.Period}/${b.Slug}/${b.Verslagsoort}` === `${bron.dataset.Period}/${bron.Slug}/${bron.Verslagsoort}`).shift()
			if (bron === undefined) return
			const url = `${get(api)}/bronnen/${data.params.Entity}/${bron.Slug}/trends`
			await fetch(url)
				.then(r => r.json())
				.then(r => r.trends as Array<{Period: number, totaal: number}>)
				.then(trend => {
					const peilBegrotingBedrag = getDatasetTotals(i, bron.dataset).Baten ?? 1
					const deltas = (): Array<{Period: number, delta: number}> =>
						trend.map(row => {
							return {
								Period: row.Period,
								delta: Math.round(10000 * ((row.totaal - peilBegrotingBedrag) / peilBegrotingBedrag))/100
							}
						})
            const label = (bron.Title + ' ' + (metric ? getMetricsText(bron, false) : '')).trim()
						dataset1.push({label, data: deltas().map(row => normalize(row.delta, bron))})
						dataset2.push({label, data: trend.map(r => normalize(r.totaal, bron))})
						if (labels.length === 0) labels.push(...trend.map(t => t.Period))
				})
      .catch(e => {
        alert('Er ging iets mis bij het maken van de grafiek.')
        console.log(e)
      })
		}
		new Chart(chart1, { type: 'bar', data: { labels, datasets: dataset1 }})
		new Chart(chart2, { type: 'bar', data: { labels, datasets: dataset2 }})
	}

  onMount(async () => {
		const {Autocomplete} = await import('$lib/autocomplete');
		const bootstrap = await import('bootstrap');
		loader = new bootstrap.Modal(document.getElementById('loading')!)
    const onSelectItem = async (arg: {label: string, value: string, field: any}) => {
      let [_, Slug] = (arg.value as string).split('|')
			arg.field.value = ''
			data.requested.push({
				Slug, Title: arg.label, Verslagsoort: data.bronnen[0].Verslagsoort, Period: data.bronnen[0].dataset.Period
			})
			return await go()
    }
    document.body.addEventListener('keydown', (ev) => {
      // @ts-ignore
      if (ev.target?.tagName.toUpperCase() == 'INPUT') return
      if(ev.key === '/') {
        ev.preventDefault()
        findSource.focus()
        findSource.select()
      }
    })
    fetch(`${get(api)}/utils/bronnen/${data.params.Entity}/${data.bronnen[0].dataset.Period}`)
      .then(res => res.json())
			.then(d => d as Array<{Type: string, Slug: string, label: string, entiteit: string, value: string}>)
      .then(bronnen => {
        const opts = { data: bronnen.filter(bron => true ||!slugs().includes(bron.Slug)), threshold: 1, maximumItems: 10, onSelectItem, showEntity: false}
        new Autocomplete(document.getElementById('find-source'), opts)
      })
		await charts()
  })

  const getDatasetTotals = (ix: number, dataset: SingleDataSet) => dataset.verslagsoorten[data.requested[ix].Verslagsoort]
  
</script>
<style>
	.hidden { display: none;}
	.summaries td { vertical-align: middle;}
</style>
<svelte:head>
	<title>{titles} | Open Spending</title>
	<meta property="og:title" content="{titles} | Open Spending" />
</svelte:head>
<div class="modal fade modal-fullscreen" data-bs-backdrop="static" data-bs-keyboard="false" id="loading">
	<div class="modal-dialog">
		<div class="d-flex justify-content-center" style="margin-top: 400px;">
			<div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	</div>
</div>
<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<!-- <li class="breadcrumb-item"><a href="/gegevens">Gegevens</a></li> -->
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
		<li class="breadcrumb-item" aria-current="page">{titles}</li>
		<li class="breadcrumb-item" aria-current="page">per</li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{ucfirst(data.groepering)}
			  </a>
				<ul class="dropdown-menu">
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => {data.groepering = 'categorie'; go()}}>Categorie</a></li>
					<li><a class="dropdown-item" href="{'#'}" on:click|preventDefault={() => {data.groepering = 'hoofdfunctie'; go()}}>Hoofdfunctie</a></li>
				</ul>
			</span>
		</li>
	</ol>
</nav>

<h1>{titles}</h1>
<div class="mb-5">
  <h2 class="fs-4">{Bron.dataset.Summary} <br><em class="fs-6">({#if !metric}bedragen in € 1.000, {/if}bron: {Bron.dataset.Title})</em></h2>
  {#if isThereAnyDetaildataAvaliable()}
    <small style="font-weight: normal">(een <code>*</code> in de keuze voor Jaar geeft aan dat er detaildata beschikbaar is voor dat jaar)</small>
  {/if}
</div>
<div class="row mb-5">
	<div class="col-sm-12 col-m-9 col-lg-8">
		<table class="table summaries ">
			<thead>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<th class="text-end">Baten</th>
					<th class="text-end">Lasten</th>
					<th class="text-end">Jaar</th>
					<th class="text-end">Periode</th>
				</tr>
			</thead>
			<tbody>
				{#each data.bronnen as bron, ix}
				<tr>
					<th scope="row" style="width:1px;">
						<a href="{'#'}" style="margin-right: 5px" on:click={() => verwijderBron(bron)}><XSquareFill/></a>
					</th>
					<th scope="row">
						{bron.Title} 
					</th>
					<th scope="row" style="width:1px;">
            {#if bron.dataset.StatLine}
            <a title="Open Link in CBS StatLine" href="{bron.dataset.StatLine}" target="_blank" rel="noreferrer" style="text-decoration: none; border: none;">
              <img src="/images/CBS-32x32.png" style="width: 24px;" alt="CBS Logo">
            </a>
            {/if}
					</th>
					<td class="text-end" style="white-space: nowrap;"><Currency ammount={getDatasetTotals(ix, bron.dataset).Baten}/></td>
					<td class="text-end" style="white-space: nowrap;"><Currency ammount={getDatasetTotals(ix, bron.dataset).Lasten}/></td>
					<td class="text-end">
						<select class="form-select" on:change={(ev) => setPeriode(bron, ev.currentTarget.value)}>
							{#each bron.datasets as dataset}
							<option selected={bron.dataset.Period === dataset.Period}>{dataset.Period} 
              {#if dataset.hasDetaildata && !isLive($page.url.hostname)}
              *
              {/if}
              </option>
							{/each}
						</select>
					</td>
					<td class="text-end">
						{#if Object.keys(bron.dataset.verslagsoorten).length === 1}
						{bron.Verslagsoort}
						{:else}
						<select class="form-select" on:change={(ev) => setVerslagsoort(bron, ev.currentTarget.value)}>
							{#each Object.keys(bron.dataset.verslagsoorten) as verslagsoort}
							<option selected={bron.Verslagsoort === verslagsoort}>{verslagsoort}</option>
							{/each}
						</select>
						{/if}
					</td>
				</tr>
				{/each}
			</tbody>
		</table>
		<div class="input-group mt-2"
			class:hidden={data.bronnen.length >= 3}
		>
			<input autocomplete="off" id="find-source" bind:this={findSource} aria-label="Zoek" class="form-control" type="text" size="20" placeholder={`voeg ${brontype} toe om te vergelijken …`}>
			<span class="input-group-text"><kbd>/</kbd></span>
		</div>
	</div>
</div>

<div>
	<table class="table table-hover caption-top table-bordered">
  <caption>
    <form class="row row-cols-lg-auto g-3 align-items-center">
      <div class="col-12">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" bind:checked={hideZero}/>
          verberg lege bedragen
        </label>
      </div>
    {#if Bron.metrics && Object.keys(Bron.metrics).length > 0}
      <div class="col-12">
        <label class="form-check-label" for="metric">
          Normaliseer bedragen op basis van:
        </label>       
      </div>
      <div class="col-12">
        <select class="form-select" aria-label="Selecteer een waarde voor normalisering" id="metric" on:change={() => charts()} bind:value={metric}>
          <option selected value="">-</option>
          {#each Object.keys(Bron.metrics) as key}
          <option>{key}</option>
          {/each}
        </select>    
      </div>
    {/if}
    </form>
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
				<th class="text-center" >{bron.Title}</th>
				{/each}
				{#each data.bronnen as bron}
				<th class="text-center" >{bron.Title}</th>
				{/each}
			</tr>
      {/if}
      {#if metric}
			<tr>
				<th>&nbsp;</th>
				<th class="code">&nbsp;</th>
				<th>&nbsp;</th>
				{#each data.bronnen as bron}
				<td class="text-center"><small>{@html getMetricsText(bron)}</small></td>
				{/each}
				{#each data.bronnen as bron}
				<td class="text-center" ><small>{@html getMetricsText(bron)}</small></td>
				{/each}
			</tr>
      {/if}
      {#if isThereAnyDetaildataAvaliable()}
			<tr>
				<th>&nbsp;</th>
				<th class="code">&nbsp;</th>
				<th>&nbsp;</th>
				{#each data.bronnen as bron}
				<td class="text-center">
          {#if (bron.dataset.hasDetaildata && !isLive($page.url.hostname))}
          <a href="/gegevens/{bron.Type}/details/{bron.Slug}/{bron.dataset.Identifier}"><FileEarmarkSpreadsheet/> details</a>
          {/if}
        </td>
				{/each}
				{#each data.bronnen as bron}
				<td class="text-center">
          {#if (bron.dataset.hasDetaildata)}
          <a href="/gegevens/{bron.Type}/details/{bron.Slug}"><FileEarmarkSpreadsheet/> details</a>
          {/if}
        </td>
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
      metric={metric}
			bronnen={data.bronnen}/>
		{/each}
		</tbody>
		<tfoot>
			<td></td>
			<td></td>
			<td></td>
			{#each data.bronnen as bron, ix}
				<th class="text-end"><Currency classes="text-white p-1 bg-primary" ammount={normalize(getDatasetTotals(ix, bron.dataset).Baten, bron)} /></th>
			{/each}
			{#each data.bronnen as bron, ix}
				<th class="text-end"><Currency classes="text-white p-1 bg-info" ammount={normalize(getDatasetTotals(ix, bron.dataset).Lasten, bron)} /></th>
			{/each}
		</tfoot>
	</table>
</div>
<div class="row">
	<div class="col-sm-12 col-lg-6">
		<h3 class="fs-4">{#if data.bronnen[0].Type === 'GemeenschappelijkeRegelingen'}Realisatie{:else}Begroting{/if} per jaar {#if metric}(normalisatie <em>{metric}</em>){/if}</h3>
		<div style="width: 100%; height: 500px;"><canvas id="chart2"></canvas></div>
	</div>
	<div class="col-sm-12 col-lg-6">
		<h3 class="fs-4">Verschillen met gekozen jaar {#if metric}(normalisatie <em>{metric}</em>){/if}</h3>
		<div style="width: 100%; height: 500px;"><canvas id="chart1"></canvas></div>
	</div>
</div>
