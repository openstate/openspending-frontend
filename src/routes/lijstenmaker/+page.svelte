<script lang="ts">
	import LijstenMaker from '$lib/LijstenMaker.svelte';
	import { ucfirst } from '$lib/utils';
	import { onMount } from 'svelte';
	const currentYear = new Date().getFullYear();
	const years: number[] = [];
	for (let year = currentYear; year >= 2009; year--) years.push(year);

	const api = import.meta.env.PROD
		? 'https://data.openspending.nl'
		: 'http://localhost:3000'
	
	const getTop = () => {
		switch (lijsten.aantal.defaultValue) {
			case 'tien': return 10
			case 'twintig': return 20
			case 'vijftig': return 50
			case 'alle': return 'alles'
			default: return 10
		}
	}

	const getSourceType = () => {
		return lijsten.kind.defaultValue?.split(' ').map(woord => ucfirst(woord)).join('')

	}
	const getVerslagsoort = () => {
		switch (lijsten.aantal.defaultValue) {
			case 'hele jaar (begroting)': return 'begrote'
			case 'hele jaar (realisatie)': return 'gerealiseerde'
			case 'eerste kwartaal (realisatie)': return 'Q1'
			case 'tweede kwartaal (realisatie)': return 'Q2'
			case 'derde kwartaal (realisatie)': return 'Q3'
			case 'vierde kwartaal (realisatie)': return 'Q1'
			default: return 'begrote'
		}
	}
	$: apiUrl = `${api}/lijstenmaker/top/${getTop()}/${lijsten.order.defaultValue}/${getVerslagsoort()}/bedragen/van/${getSourceType()}/in/${lijsten.year.defaultValue}/`
// http://localhost:3000/lijstenmaker/top/10/hoogste/begrote/bedragen/van/Gemeenten/in/2022/categorygroup/6
	const lijsten: Record<string, { defaultValue?: string; choices: string[] }> = {
		disposition: {
			choices: ['zien', 'downloaden']
		},
		aantal: {
			choices: ['tien', 'twintig', 'vijftig', 'alle']
		},
		kind: {
			choices: ['gemeenten', 'provincies', 'waterschappen', 'gemeenschappelijke regelingen']
		},
		order: {
			choices: ['hoogste', 'laagste']
		},
		direction: {
			choices: ['inkomsten', 'uitgaven']
		},
		periode: {
			choices: [
				'hele jaar (begroting)',
				'hele jaar (realisatie)',
				'eerste kwartaal (realisatie)',
				'tweede kwartaal (realisatie)',
				'derde kwartaal (realisatie)',
				'vierde kwartaal (realisatie)'
			]
		},
		year: {
			defaultValue: currentYear.toString(),
			choices: years.map((year) => year.toString())
		},
		groepering: {
			choices: ['aantal inwoners', 'aantal huishoudens', 'oppervlakte', "aantal FTE's"]
		}
	};

	let onderwerpen: [] = []

	const loadOnderwerpen = async () => {
		onderwerpen = await fetch(`${api}/zoek/onderwerpen/${lijsten.year.defaultValue}/alles`).then(res => res.json())
	}

	onMount(async () => {
		await loadOnderwerpen()
		const {Autocomplete} = await import('$lib/autocomplete');
		const opts = { data: onderwerpen, threshold: 1, maximumItems: 10, onSelectItem: () => {

		}}
		new Autocomplete(document.getElementById('onderwerpen'), opts)
	})
</script>

<h1 id="title">Lijstenmaker</h1>
<pre>{apiUrl}</pre>
<p class="lead">
	Wat Buzzfeed kan, kun jij nu ook. Met de Open Spending Lijstenmaker kun je zelf een lijst maken
	met de hoogste of laagste uitgaven van verschillende overheden. Gewoon omdat het kan.
</p>

<h2 class="display-6 fw-bold" id="lijstenmaker">
	Ik wil de
	<LijstenMaker
		choices={lijsten.aantal.choices}
		defaultValue={lijsten.aantal.defaultValue}
		bind:value={lijsten.aantal.defaultValue}
	/>
	<LijstenMaker
		choices={lijsten.order.choices}
		defaultValue={lijsten.order.defaultValue}
		bind:value={lijsten.order.defaultValue}
	/>
	bedragen 
	<LijstenMaker
		choices={lijsten.disposition.choices}
		bind:value={lijsten.disposition.defaultValue}
	/>
	van
	<LijstenMaker
		choices={lijsten.kind.choices}
		defaultValue={lijsten.kind.defaultValue}
		bind:value={lijsten.kind.defaultValue}
		on:change={loadOnderwerpen}
	/>
	in het
	<LijstenMaker
		choices={lijsten.periode.choices}
		defaultValue={lijsten.periode.defaultValue}
		bind:value={lijsten.periode.defaultValue}
	/>
	<LijstenMaker
		choices={lijsten.year.choices}
		defaultValue={lijsten.year.defaultValue}
		bind:value={lijsten.year.defaultValue}
	/>
	{#if lijsten.kind.defaultValue === 'gemeente' || lijsten.kind.defaultValue === 'provincie'}
	omgerekend naar
	<LijstenMaker
		choices={lijsten.groepering.choices}
		defaultValue={lijsten.groepering.defaultValue}
		bind:value={lijsten.groepering.defaultValue}
	/>
	{/if}
	over het onderwerp
	<input id="onderwerpen" autocomplete="off" data-bind="onderwerp" class="form-control w-auto d-inline-flex " type="search"/>
	 .
</h2>
<button class="btn btn-primary btn-lg" type="button"
	>{lijsten.disposition.defaultValue === 'downloaden' ? 'Download' : 'Toon'} mijn Lijst</button
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
