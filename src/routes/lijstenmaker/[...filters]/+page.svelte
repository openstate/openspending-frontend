<script lang="ts">
	import { goto } from '$app/navigation';
	import LijstenMaker from '$lib/LijstenMaker.svelte';
	import { onMount } from 'svelte';
	export let data

	const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://localhost:3000'
	
	const getUrl = () => `/lijstenmaker/top/${filter.aantal.value}/${filter.volgorde.value}/bedragen/zien/van/${filter.bron.value}/in/${filter.periode.value}/${filter.verslagsoort.value}/onderwerp/${filter.onderwerp.value}`

	// $: apiUrl = `${api}/lijstenmaker/top/${getTop()}/${lijsten.order.defaultValue}/${getVerslagsoort()}/bedragen/van/${getSourceType()}/in/${lijsten.year.defaultValue}/`
	const periode: Record<string, number> = {}
	for (let year = new Date().getFullYear(); year >= 2011; year--)  periode[year.toString()] = year
	const lijsten: Record<string, Record<string, string | number>> = {
		disposition: {
			zien: 'inline',
			downloaden: 'download'
		},
		aantal: {
			tien: 10,
			twintig: 20,
			vijftig: 50,
			alle: -1
		},
		bron: {
			gemeenten: 'Gemeenten',
			provincies: 'Provincies',
			waterschappen: 'Waterschappen',
			'gemeenschappelijke regelingen': 'GemeenschappelijkeRegelingen'
		},
		volgorde: {
			hoogste: 'ASC',
			laagste: 'DESC'
		},
		BL: {
			inkomsten: 'Baten',
			uitgaven: 'Lasten'
		},
		verslagsoort: {
				'begroote': 'Q0',
				'gerealiseerde': 'Q5',
				'eerste kwartaal van': 'Q1',
				'tweede kwartaal van': 'Q2',
				'derde kwartaal van': 'Q3',
				'vierde kwartaal van': 'Q4'
		},
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
			(document.querySelector('#onderwerpen input')! as HTMLInputElement).value = ''
			goto(route)
		}}
		document.getElementById('onderwerpen')!.innerHTML = ''
		const input: HTMLInputElement = document.createElement('input')
		input.autocomplete ='off'
		input.type = 'search'
		input.classList.add('form-control', 'form-control-lg',  'w-auto', 'd-inline-flex')
		document.getElementById('onderwerpen')!.appendChild(input)
		new Autocomplete(input, opts)
	}

	onMount(async () => {
		makeAutocomplete()
	})
	let route = getUrl()
	const updateRoute = (filterName: keyof typeof filter, label: string, value: string | number) => {
		filter[filterName] = {label, value}
		route = getUrl()
		goto(route)
	}
</script>

<h1 id="title">Lijstenmaker</h1>
<pre>{route}</pre>

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
	bedragen 
	<LijstenMaker
		choices={lijsten.disposition}
		defaultValue={filter.disposition.label}
		onchange={(label, value) => updateRoute('disposition', label, value)}
	/>
	van
	<LijstenMaker
		choices={lijsten.bron}
		defaultValue={filter.bron.label}
		onchange={(label, value) => updateRoute('bron', label, value)}
	/>
	in het
	<LijstenMaker
		choices={lijsten.verslagsoort}
		defaultValue={filter.verslagsoort.label}
		onchange={(label, value) => updateRoute('verslagsoort', label, value)}
	/> van het jaar
	<LijstenMaker
		choices={lijsten.periode}
		defaultValue={filter.periode.label}
		onchange={(label, value) => updateRoute('periode', label, value)}
	/>
	{#if filter.bron.value === 'gemeente' || filter.bron.value === 'provincie'}
	omgerekend naar
	<LijstenMaker
		choices={lijsten.groepering}
		defaultValue={filter.groepering.label}
		onchange={(label, value) => updateRoute('groepering', label, value)}
	/>
	{/if}
	over het onderwerp
	<span id="onderwerpen"></span>
</h2>
<button class="btn btn-primary btn-lg" type="button"
	>{filter.disposition.label === 'downloaden' ? 'Download' : 'Toon'} mijn Lijst</button
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

<style>
	h2 {
		color: var(--purple);
	}
</style>
