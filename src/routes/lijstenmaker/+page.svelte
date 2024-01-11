<script lang="ts">
	import LijstenMaker from '$lib/LijstenMaker.svelte';
	const currentYear = new Date().getFullYear();
	const years: number[] = [];
	for (let year = 2009; year <= currentYear; year++) years.push(year);

	const lijsten: Record<string, { defaultValue?: string; choices: string[] }> = {
		disposition: {
			choices: ['zien', 'downloaden']
		},
		aantal: {
			choices: ['tien', 'twintig', 'vijftig', 'alle']
		},
		kind: {
			choices: ['gemeente', 'provincie', 'waterschap', 'gemeenschappelijke regeling', 'stadsdeel']
		},
		order: {
			choices: ['hoogste', 'laagste']
		},
		plan: {
			choices: ['begrote', 'gerealiseerde']
		},
		direction: {
			choices: ['inkomsten', 'uitgaven']
		},
		periode: {
			choices: [
				'hele jaar',
				'eerste kwartaal',
				'tweede kwartaal',
				'derde kwartaal',
				'vierde kwartaal'
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
</script>

<h1 id="title">Lijstenmaker</h1>
<p class="lead">
	Wat Buzzfeed kan, kun jij nu ook. Met de Open Spending Lijstenmaker kun je zelf een lijst maken
	met de hoogste of laagste uitgaven van verschillende overheden. Gewoon omdat het kan.
</p>

<h2 class="display-6 fw-bold" id="lijstenmaker">
	Ik wil een lijst
	<LijstenMaker
		choices={lijsten.disposition.choices}
		bind:value={lijsten.disposition.defaultValue}
	/>
	van de
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
	<LijstenMaker
		choices={lijsten.plan.choices}
		defaultValue={lijsten.plan.defaultValue}
		bind:value={lijsten.plan.defaultValue}
	/>
	<LijstenMaker
		choices={lijsten.direction.choices}
		defaultValue={lijsten.direction.defaultValue}
		bind:value={lijsten.direction.defaultValue}
	/>
	per
	<LijstenMaker
		choices={lijsten.kind.choices}
		defaultValue={lijsten.kind.defaultValue}
		bind:value={lijsten.kind.defaultValue}
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
	omgerekend naar
	<LijstenMaker
		choices={lijsten.groepering.choices}
		defaultValue={lijsten.groepering.defaultValue}
		bind:value={lijsten.groepering.defaultValue}
	/>
	over het onderwerp "<a href={'#'}>@TODO</a>" .
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
