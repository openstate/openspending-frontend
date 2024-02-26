<script lang="ts">
	import { onMount } from 'svelte';
	import type { BronDetail } from '../../Types';
	import DataTable from '$lib/DataTable.svelte';
  let bron1: BronDetail
  let bron2: BronDetail
  let Period: number = new Date().getFullYear()
  let hideZero = true
  let BL='baten'
  $: baten = BL === 'baten'
  onMount(async () => {
    const {Autocomplete} = await import('$lib/autocomplete');
    const api = import.meta.env.PROD
      ? 'https://data.openspending.nl'
      : 'http://localhost:3000'
    
    const onSelectItem = async (arg: {label: string, value: string, field: any}) => {
      let [Entity, Slug] = (arg.value as string).split('|')
      const bron = await (await fetch(`${api}/bronnen/${Entity}/${Slug}`)).json()
      const dataset = await (await fetch(bron.datasets[0].$link)).json()
			const verslagsoort = (Object.keys(dataset.$links).shift())
			const url = `${api}/bronnen/${Entity}/${Slug}/${bron.datasets[0].Period}/${verslagsoort}/per/categorie`; 
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if(arg.field.dataset.bind === 'bron1') {
            bron1 = data
            document.getElementById('org2')?.focus()
          }
          if(arg.field.dataset.bind === 'bron2') bron2 = data
        })
    }
    fetch(`${api}/bronnen/alles`)
      .then(res => res.json())
      .then(bronnen => {
        const opts = { data: bronnen, threshold: 1, maximumItems: 10, onSelectItem}
        new Autocomplete(document.getElementById('org1'), opts)
        new Autocomplete(document.getElementById('org2'), opts)
      })
  })
</script>
<h1>Vergelijk de gegevens tussen twee organisaties</h1>
<p class="lead">Met deze tool kunt u eenvoudig de financiële huishouding van twee organisaties vergelijken.</p>
<div class="row">
  <div class="col-sm-6 col-lg-4">
    <input id="org1" autocomplete="off" data-bind="bron1" class="form-control" type="search" placeholder="Vergelijk Instelling&hellip;" />
  </div>
  <div class="col-sm-6 col-lg-4">
    <input id="org2" autocomplete="off" data-bind="bron2" class="form-control" type="search" placeholder="met Instelling&hellip;" />
  </div>
  <div class="col-sm-12 col-lg-4">
    <input class="form-check-input" value="baten" type="radio" id="bronB" bind:group={BL}>
    <label class="form-check-label" for="bronB">baten</label>
    <input class="form-check-input" value="lasten" type="radio" id="bronL" bind:group={BL}>
    <label class="form-check-label" for="bronL">lasten</label>
    <!-- <label class="form-check-label" for="Period">Jaar</label>
    <input id="Period" type="number" min="2010" max="{new Date().getFullYear()}" bind:value={Period}/> -->
  </div>
</div>
<hr>
<div class="row">
  <div class="col-sm-12 col-lg-6 mt-3">
    {#if bron1!==undefined}
    <h3 class="fs-4 fw-bold">{bron1.Title}</h3>
    {/if}
    <DataTable bron={bron1} baten={baten} hideZero={hideZero} />
  </div>
  <div class="col-sm-12 col-lg-6 mt-3">
    {#if bron2!==undefined}
    <h3 class="fs-4 fw-bold">{bron2.Title}</h3>
    {/if}
    <DataTable bron={bron2} baten={baten} hideZero={hideZero} />
  </div>
</div>