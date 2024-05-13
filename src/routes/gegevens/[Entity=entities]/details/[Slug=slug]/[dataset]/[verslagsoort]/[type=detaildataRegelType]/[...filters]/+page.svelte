<script lang="ts">
	import { goto } from '$app/navigation';
	import Currency from '$lib/Currency.svelte';
	import { isLive, ucfirst } from '$lib/utils.js';
	import { onMount } from 'svelte';
  import { DashSquareFill, PlusSquareFill, Download } from 'svelte-bootstrap-icons';
  export let data
  import { page } from '$app/stores';
	import { api } from '../../../../../../../../../stores';
  import { get } from 'svelte/store'

  $: idPrefix = data.params.type.substring(0, 1).toUpperCase()

  const toggleRow = (ev: Event) => {
    const row = ev.currentTarget as HTMLTableRowElement
    const categorie = row.dataset.categorie
    let key = row.dataset.filterKey ?? ''
    if (Object.hasOwn(data.filters, key)) {
      let id = row.dataset.id!
      if (categorie !== undefined) {
        id = `${categorie}|${id}`
      }
      let filter = data.filters[key as keyof typeof data.filters]
      if (filter.includes(id)) {
        filter = filter.filter(v => v !== id)
      } else {
        filter.push(id)
      }
      data.filters[key as keyof typeof data.filters] = filter
        .filter(v => v.trim()!=='')
        .sort((a, b) => a > b ? 1 : -1)
      goto(`/gegevens/Gemeenten/details/${data.params.Slug}/${data.params.dataset}/${data.params.verslagsoort}/${data.params.type}/categorie=${data.filters.categorie.join(',')}/grootboek=${data.filters.grootboek.join(',')}/kostenplaats=${data.filters.kostenplaats.join(',')}/#${row.id}`)
    }
  }

  const verslagsoortMod = (raw: string) => {
    if (raw.endsWith('0')) return 'begroting'
    if (raw.endsWith('1')) return 'Q1'
    if (raw.endsWith('2')) return 'Q2'
    if (raw.endsWith('3')) return 'Q3'
    if (raw.endsWith('4')) return 'Q4'
    if (raw.endsWith('5')) return 'realisatie'
  }

  onMount(() => {
    if (document.location.hash) {
      const id = document.location.hash.replace(/^#/, '')
      const row = document.querySelector(`[id="${id}"]`)
      if (row) {
        row.classList.add('highlight')
        setTimeout(() => {
          row.classList.remove('highlight')
          row.classList.add('no-highlight')
          row.classList.add('table-active')
        }, 500)

      }
    }
  })
  </script>
<svelte:head>
	<title>Detaildata {data.bron.Title} | Open Spending</title>
	<meta property="og:title" content="Detaildata {data.bron.Title}} | Open Spending" />
</svelte:head>
<style>
  .togglerow {width: 1px}
  .l2 {padding-left: 36px}
  tbody > tr { cursor: pointer;}

:global(tr.highlight, tr.highlight td) {
  transition-property: background-color color;
  transition-timing-function: ease-in-out;
  background-color: var(--magenta);
  color: White;
  transition-duration: 0.5s;
}

:global(tr.no-highlight, tr.no-highlight td) {
  transition-property: background-color color;
  transition-timing-function: ease-in-out;
  background-color: inherit;
  color: inherit;
  transition-duration: 0.5s;
}
</style>
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
		<li class="breadcrumb-item" aria-current="page">detaildata per</li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{ucfirst(data.params.type)}
			  </a>
				<ul class="dropdown-menu">
					<li><a class="dropdown-item" href="/gegevens/{data.params.Entity}/details/{data.params.Slug}/{data.params.dataset}/{data.params.verslagsoort}/grootboek/categorie/*">Grootboek</a></li>
					<li><a class="dropdown-item" href="/gegevens/{data.params.Entity}/details/{data.params.Slug}/{data.params.dataset}/{data.params.verslagsoort}/kostenplaats/categorie/*">Kostenplaats</a></li>
				</ul>
			</span>
		</li>
    {#if data.periodes.length > 1}
		<li class="breadcrumb-item" aria-current="page">periode</li>
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{data.dataset.Period}
			  </a>
				<ul class="dropdown-menu">
          {#each data.periodes as periode}
  					<li><a class="dropdown-item" href="/gegevens/{data.params.Entity}/details/{data.params.Slug}/{periode.Identifier}/{data.params.verslagsoort}/{data.params.type}/categorie/*">{periode.Period}</a></li>
          {/each}
				</ul>
			</span>
		</li>
    {/if}
    {#if data.verslagsoorten.length > 1}
		<li class="breadcrumb-item" aria-current="page">
			<span class="dropdown">
			  <a href="{'#'}" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    			{verslagsoortMod(data.params.verslagsoort)}
			  </a>
				<ul class="dropdown-menu">
          {#each data.verslagsoorten as verslagsoort}
  					<li><a class="dropdown-item" href="/gegevens/{data.params.Entity}/details/{data.params.Slug}/{data.params.dataset}/{verslagsoort}/{data.params.type}/categorie/*">{verslagsoortMod(verslagsoort)}</a></li>
          {/each}
				</ul>
			</span>
		</li>
    {/if}
	</ol>
</nav>

<h1>Detaildata {data.bron.Title}</h1>
<div class="mb-5">
  <h2 class="fs-4">{data.dataset.Summary} <em><br>bron: {data.dataset.Title})</em></h2>
  <p><small><a href="/gegevens/detaildata">klik hier om meer organisaties met detaildata te bekijken &hellip;</a></small></p>
</div>

{#if (isLive($page.url.hostname))}
<div class="alert alert-info">
De detaildata van {data.dataset.Title} is helaas nog niet beschikbaar, probeer het later nogmaals.
</div>
{:else}
<table class="table table-hover caption-top table-bordered">
  <thead>
    <tr>
      <th class="togglerow">&nbsp;</th>
      <th>Code</th>
      <th>Titel</th>
      <th class="text-end">Baten</th>
      <th class="text-end">Lasten</th>
    </tr>
  </thead>
  <tbody>
    {#each data.rows as row}
      <tr
        id="C{row.Code}"
        data-id={row.Code}
        data-filter-key="categorie"
        class:fw-bold={Object.hasOwn(row, 'rows') }
        on:click={toggleRow}
      >
        <td class="toglerow">
          {#if Object.hasOwn(row, 'rows')}
          <DashSquareFill style="cursor: pointer;"/>
          {:else}
          <PlusSquareFill style="cursor: pointer;" fill="#888"/>
          {/if}
        </td>
        <td width=1>{row.Titel.split(' ').shift()}</td>
        <td>{row.Titel.replace(/^\d+/, '').trim()}</td>
        <td class="text-end"><Currency classes="text-primary"  ammount={row.Baten}/></td>
        <td class="text-end"><Currency classes="text-info" ammount={row.Lasten}/></td>
      </tr>
      {#if (Object.hasOwn(row, 'rows'))}
      {#each row.rows ?? [] as subrow}
      <tr
        id="C{row.Code}{idPrefix}{subrow.Code}"
        data-id={subrow.Code}
        data-filter-key="{data.params.type}"
        data-categorie="{row.Code}"
        class:fw-bold={Object.hasOwn(subrow, 'rows') }
        on:click={toggleRow}
      >
        <td class="toglerow l2">
          {#if Object.hasOwn(subrow, 'rows')}
          <DashSquareFill style="cursor: pointer;"/>
          {:else}
          <PlusSquareFill style="cursor: pointer;" fill="#888"/>
          {/if}
        </td>
        <td width=1>{subrow.Code}</td>
        <td>{subrow.Titel}</td>
        <td class="text-end"><Currency classes="text-primary"  ammount={subrow.Baten === 0 ? undefined : subrow.Baten}/></td>
        <td class="text-end"><Currency classes="text-info" ammount={subrow.Lasten === 0 ? undefined : subrow.Lasten}/></td>
      </tr>
      {#if (Object.hasOwn(subrow, 'rows'))}
      {#each subrow.rows ?? [] as subsubrow}
        <tr>
          <td>&nbsp;</td>
          <td width=1>{subsubrow.Code}</td>
          <td>{subsubrow.Titel}</td>
          <td class="text-end"><Currency classes="text-primary"  ammount={subsubrow.Baten === 0 ? undefined : subsubrow.Baten}/></td>
          <td class="text-end"><Currency classes="text-info" ammount={subsubrow.Lasten === 0 ? undefined : subsubrow.Lasten}/></td>
        </tr>
      {/each}
      {/if}
      {/each}
      {/if}
    {/each}
  </tbody>
</table>
<p class="mt-5"><a href="{get(api)}/detaildata/{data.params.Entity}/{data.bron.Key}/{data.dataset.Identifier}/{data.params.verslagsoort}.json"><button class="btn btn-primary"><Download/> download brondata</button></a></p>
{/if}
