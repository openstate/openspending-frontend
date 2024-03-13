<script lang="ts">
	import { goto } from '$app/navigation';
	import LijstenMaker from '$lib/LijstenMaker.svelte';
	import { ucfirst } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Download, ListUl, Record, XSquareFill } from 'svelte-bootstrap-icons';

  let loader: bootstrap.Modal;
  type Lijst = {
    lijst: Record<string, {Title: string, Slug: string, Description: string, Baten: number, Lasten: number}>,
    onderwerp: {
      Soort: string
      Key: string
      Title: string
      Description: string
    }
  } 
  let lijst: Lijst| undefined
	const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://host.docker.internal:3000'
	
	const getUrl = () => `/lijstenmaker/${filter.volgorde.value}/${filter.aantal.value}/${filter.BL.value}/${filter.bron.value}/${filter.periode.value}X${filter.verslagsoort.value}/${filter.onderwerp.value}`

  const toonLijst = async () => {
    loader.show()
    fetch(`${api}${getUrl()}`)
      .then(async res => {
        if (res.ok) {
          lijst = await res.json()
          loader.hide()
        } else {
          alert('Sorry, fout aan onze kan bij het ophalen van de lijst.')
        }
      })
      .catch(e => alert('Sorry, fout aan onze kan bij het ophalen van de lijst.'))
  }

  const download = () => {
    if (lijst === undefined) return
    const data: Array<number|string>[] = [
      ['Bron',
        filter.BL.value,
        'Link',
      ]
    ]

    Object.values(lijst.lijst).map(row => data.push([
      `"${row.Title}"`,
      filter.BL.value === 'Baten' ? 1000 * row.Baten : 1000 * row.Lasten,
      `https://test.openspending.nl/gegevens/${filter.bron.value}/per/hoofdfunctie/${row.Slug}/${filter.periode.value}/${getVerslagSoortVoorFrontendRoute(filter.verslagsoort.value.toString())}`
    ]))
    const csvContent = "data:text/csv;charset=utf-8," + data.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'openspending-lijst.csv');
    document.body.appendChild(link);
    link.click();
  }

	const verslagsoorten = {
		'begroote': '000',
		'gerealiseerde': '005',
		'eerste kwartaal van': '001',
		'tweede kwartaal van': '002',
		'derde kwartaal van': '003',
		'vierde kwartaal van': '004'
	}

	const verslagsoortenByKey: Record<string, string> = {
		'000': 'begroote',
		'005': 'gerealiseerde',
		'001': 'eerste kwartaal van',
		'002': 'tweede kwartaal van',
		'003': 'derde kwartaal van',
		'004': 'vierde kwartaal van'
	}

  const getVerslagSoortVoorFrontendRoute = (verslagsoortValue: string) => {
    switch (verslagsoortValue) {
      case '000': return 'begroting'
      case '005': return 'realisatie'
      case '001': return 'Q1'
      case '002': return 'Q2'
      case '003': return 'Q3'
      case '004': return 'Q3'
      default: return 'begroting'
    }

  }

	// $: apiUrl = `${api}/lijstenmaker/top/${getTop()}/${lijsten.order.defaultValue}/${getVerslagsoort()}/bedragen/van/${getSourceType()}/in/${lijsten.year.defaultValue}/`
	const periode: Record<string, number> = {}
	for (let year = new Date().getFullYear(); year >= 2011; year--)  periode[year.toString()] = year
	const lijsten: Record<string, Record<string, string | number>> = {
		aantal: {
			tien: 10,
			twintig: 20,
			vijftig: 50,
		},
		bron: {
			gemeenten: 'Gemeenten',
			provincies: 'Provincies',
			// waterschappen: 'Waterschappen',
			'gemeenschappelijke regelingen': 'GemeenschappelijkeRegelingen'
		},
		volgorde: {
			hoogste: 'hoogste',
			laagste: 'laagste'
		},
		BL: {
			inkomsten: 'Baten',
			uitgaven: 'Lasten'
		},
		verslagsoort: { ...verslagsoorten },
		periode,
		groepering: {
			'aantal inwoners': 'inwoners',
			'aantal huishoudens': 'huishoudens', 
			'oppervlakte': 'oppervlakte', 
			"aantal FTE's": 'FTE'
		},
		onderwerp: {
			'onderwerp': ''
		}
	};
	let onderwerp: string = ''

	const filter: Record<keyof typeof lijsten, {label: string, value: string | number}> = {
	}
	for (const key of Object.keys(lijsten)) {
		filter[key] = {label: Object.keys(lijsten[key])[0], value: Object.values(lijsten[key])[0]}
	}
	filter.periode = {label: new Date().getFullYear().toString(), value: new Date().getFullYear()}

	const makeAutocomplete = async () => {
		const data = await fetch(`${api}/zoek/onderwerpen/${filter.periode.value}/alles`).then(res => res.json())
		const {Autocomplete} = await import('$lib/autocomplete');
		const opts = { data, threshold: 1, maximumItems: 10, onSelectItem: (picked: {value: string, label: string}) => {
			filter.onderwerp = picked
			route = getUrl();
			onderwerp = picked.label;
			(document.querySelector('#onderwerpen input')! as HTMLInputElement).value = ''
		}}
		document.getElementById('onderwerpen')!.innerHTML = ''
		const input: HTMLInputElement = document.createElement('input')
		input.autocomplete ='off'
		input.type = 'search'
		input.placeholder = "zoek onderwerp …"
		input.classList.add('form-control', 'form-control-lg',  'w-auto', 'd-inline-flex')
		document.getElementById('onderwerpen')!.appendChild(input)
		new Autocomplete(input, opts)
	}
	$: quotedOnderwerp = onderwerp ? `&ldquo;${onderwerp}&rdquo;` : ''

	onMount(async () => {
		const bootstrap = await import('bootstrap');
		loader = new bootstrap.Modal(document.getElementById('loading')!)
		makeAutocomplete()
	})
	let route = getUrl()
	const updateRoute = async (filterName: keyof typeof filter, label: string, value: string | number) => {
		filter[filterName] = {label, value}
		if (filterName === 'periode') {
			await fetch(`${api}/lijstenmaker/hoogste/10/${filter.bron.value}/${filter.periode.value}`)
				.then(res => res.json())
				.then(res =>  res as {$links: string[]})
				.then(links => {
					const $verslagsoorten = links.$links.map(url => url.split('/').pop()?.split('X').pop())
					const newVerslagsoorten: Record<string, string> = {}
					for (const verslagsoort of $verslagsoorten) {
						if (!verslagsoort) continue
						newVerslagsoorten[verslagsoortenByKey[verslagsoort]] = verslagsoort
					}
					if(!$verslagsoorten.includes(filter.verslagsoort.value.toString())) {
						filter.verslagsoort = {label: Object.keys(newVerslagsoorten)[0], value: Object.values(newVerslagsoorten)[0]}
					}
					lijsten.verslagsoort = newVerslagsoorten
				})
		}
		route = getUrl()
	}
</script>

<div class="modal fade modal-fullscreen" data-bs-backdrop="static" data-bs-keyboard="false" id="loading">
	<div class="modal-dialog">
		<div class="d-flex justify-content-center" style="margin-top: 400px;">
			<div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status">
				<span class="visually-hidden">Bezig met laden...</span>
			</div>
		</div>
	</div>
</div>

<h1 id="title">Lijstenmaker</h1>

{#if !lijst}
<p class="lead">
	Wat Buzzfeed kan, kun jij nu ook. Met de Open Spending Lijstenmaker kun je zelf een lijst maken
	met de hoogste of laagste uitgaven van verschillende overheden. Gewoon omdat het kan.
</p>

<h2 class="display-6 fw-bold" id="lijstenmaker">
	ik wil de
	<LijstenMaker
		choices={lijsten.aantal}
		defaultValue={filter.aantal.label}
		onchange={(label, value) => updateRoute('aantal', label, value)}
	/>
	<LijstenMaker
		choices={lijsten.volgorde}
		defaultValue={filter.volgorde.label}
		onchange={(label, value) => updateRoute('volgorde', label, value)}
	/>
	<LijstenMaker
		choices={lijsten.BL}
		defaultValue={filter.BL.label}
		onchange={(label, value) => updateRoute('BL', label, value)}
	/>
	zien	van
	<LijstenMaker
		choices={lijsten.bron}
		defaultValue={filter.bron.label}
		onchange={(label, value) => updateRoute('bron', label, value)}
	/>
	in het
	<LijstenMaker
		choices={lijsten.verslagsoort}
		bind:defaultValue={filter.verslagsoort.label}
		onchange={(label, value) => updateRoute('verslagsoort', label, value)}
	/> jaar
	<LijstenMaker
		choices={lijsten.periode}
		defaultValue={filter.periode.label}
		onchange={(label, value) => updateRoute('periode', label, value)}
	/>
	{#if false && filter.bron.value === 'gemeente' || filter.bron.value === 'provincie'}
	omgerekend naar
	<LijstenMaker
		choices={lijsten.groepering}
		defaultValue={filter.groepering.label}
		onchange={(label, value) => updateRoute('groepering', label, value)}
	/>
	{/if}
	over het onderwerp
	<span id="onderwerpen" class:hide={onderwerp}></span>
	<span id="onderwerp" class="fw-bold display-6">{@html quotedOnderwerp}</span>
	{#if onderwerp}
		<a class="display-6" href="{''}" style="border: none;" on:click|preventDefault={() => {onderwerp = ''; filter.onderwerp = {label: '', value: ''}}}><XSquareFill/></a>
	{/if}
</h2>
<button class="btn btn-primary btn-lg" type="button" disabled={onderwerp === ''} on:click={() => toonLijst()}
	>Toon mijn Lijst</button
>
<button
	class="btn btn-outline-primary btn-lg"
	type="button"
	data-bs-toggle="modal"
	data-bs-target="#uitleg">Uitleg</button
>

<div class="modal fade" id="uitleg" tabindex="-1" aria-labelledby="uitlegLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="uitlegLabel">Hoe werkt de Lijstenmaker?</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Sluit"></button>
			</div>
			<div class="modal-body">
				<p>
					Je kunt kiezen voor een lijstje met een top 10, 20 of 50. Of je maakt een lijst met alle
					resultaten. Je kunt ook de volgorde kiezen, de hoogste of laagste uitgaven. Vervolgens
					kies je van welk type overheid je een lijst wilt samenstellen. Zo kun je kiezen uit de
					uitgaven van gemeenten, provincies, waterschappen of gemeenschappelijke regelingen. Ook is
					het mogelijk om een lijst te maken met alleen de begrote of de daadwerkelijk gerealiseerde
					uitgaven. Wil je niet een lijst met de uitgaven maar met inkomsten dan kan dat ook.
					Vervolgens kies je over welke periode je de lijst wilt, zoals voor het hele jaar of je
					kiest voor een kwartaal en daarna het jaar. Dan kun je in het zoekvenster invullen voor
					welk type je de uitgaven wilt zien. Denk aan bijvoorbeeld aan ambulancevervoer, sociale
					uitkeringen, sport of bij inkomsten aan baten parkeerbelasting. Vervolgens kun je bij de
					uitgaven van gemeenten en provincies er ook nog voor kiezen om in plaats van euro's de
					bedragen per inwoner of huishouden te laten omrekenen. Tenslotte klik je op de knop en je
					krijgt je lijst te zien. Wil je je lijst verder bewerken dan kun je de lijst ook nog
					downloaden en krijg je een mooie .csv waarmee je kunt spelen.
				</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Sluit</button>
			</div>
		</div>
	</div>
</div>
{:else}
<p class="fs-4">
  Jouw lijst: {filter.aantal.label} 
  {filter.volgorde.label} 
  {filter.BL.label}
  van {filter.bron.label}
  in het {filter.verslagsoort.label}
  jaar {filter.periode.label}
  over het onderwerp <em>{lijst.onderwerp.Title}</em>.
</p>
<table class="table table-striped">
  <thead>
    <tr>
      <th>Bron</th>
      <th class="text-end">{ucfirst(filter.BL.label)}</th>
    </tr>
  </thead>
  <tbody>
    {#each Object.values(lijst.lijst) as row}
      <tr>
        <td><a href="/gegevens/{filter.bron.value}/per/hoofdfunctie/{row.Slug}/{filter.periode.value}/{getVerslagSoortVoorFrontendRoute(filter.verslagsoort.value.toString())}">{row.Title}</a></td>
        <td class="text-end">€ {filter.BL.value === 'Baten' ? (1000 * row.Baten).toLocaleString() : (1000 * row.Lasten).toLocaleString() }</td>
      </tr>
    {/each}
  </tbody>
</table>
<p>
  <button class="btn btn-primary" on:click={() => download()}><Download /> Download lijst</button>
  <button class="btn btn-secondary" on:click={() => goto('/lijstenmaker')}><ListUl /> Maak nieuwe lijst</button>
</p>
{/if}

<style>
	.hide {display: none}
	h2 {
		color: var(--purple);
	}
 #onderwerp {
		color: var(--magenta);
	}
	:global(#onderwerpen input) {
		border: solid 3px var(--magenta) !important;
	}
</style>
