<script lang="ts">
	import { onMount } from 'svelte';
	import { ExclamationTriangleFill, InfoCircleFill, ListTask } from 'svelte-bootstrap-icons';
	import type { SourceType } from '../../Types.js';
  export let data
  let q: string | null
  let search: URLSearchParams | undefined
  const getType = (type: SourceType) => {
    switch (type) {
      case 'Gemeenten': return 'gemeente'
      case 'Provincies': return 'provincie'
      case 'Waterschappen': return 'waterschap'
      case 'GemeenschappelijkeRegelingen': return 'gem. regeling'
    }
  }
  onMount(() => {
    const input = document.getElementById('zoekveld')
    if (input) {
      (input as HTMLInputElement).value = data.q ?? ''
    }
    search = new URLSearchParams(window.location.search)
    q = search.get('q')
  })
</script>
<svelte:head>
	<title>Zoeken | Open Spending</title>
	<meta property="og:title" content="Zoeken | Open Spending" />
</svelte:head>
<h1>Zoeken</h1>
<p class="lead">
  Je kunt hier zoeken naar titels van diverse categorisering van baten en lasten.
  Als je meerdere woorden intypt, wordt standaard gezocht op titels met alle woorden,
  je kunt ook kiezen om met minimaal één van je woorden te zoeken.
  Kies voor geavanceerd zoeken om zelf complexe zoekopdrachten te maken. Onderaan deze pagina staat een aantal voorbeelden.
</p>
<form role="search" action="/zoek" class="mb-2">
  <div class="row mb-2">
    <div class="col">
      <input
        class="form-control me-2"
        type="search"
        name="q"
        placeholder="Zoek&hellip;"
        aria-label="Zoek"
        value="{data.q}"
      />
    </div>
    <div class="col">
      <button class="btn btn-outline-primary" type="submit">Zoek</button>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="form-check">
        <input class="form-check-input" type="radio" name="zoekmethode" id="AND" bind:group={data.zoekmethode} value="EN">
        <label class="form-check-label" for="AND">
          Zoek met alle woorden
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="zoekmethode" bind:group={data.zoekmethode} id="OR" value="OF">
        <label class="form-check-label" for="OR">
          Zoek met één van de woorden
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="zoekmethode" bind:group={data.zoekmethode} id="ADV" value="">
        <label class="form-check-label" for="ADV">
          Gevanceerd zoeken
        </label>
      </div>
    </div>
  </div>
</form>
{#if data.workspaces && data.workspaces.length > 0}
<p class="lead">
  De titel "<span class="fw-bold">{data.titel}</span>" komt voor in de volgende datasets:
</p>
<ul>
{#each data.workspaces as workspace}
  <li>{workspace.Title} ({workspace.Period})
  <br><small>{workspace.Summary}</small></li>
{/each}
</ul>
<button class="btn btn-primary" on:click={() => data.workspaces = []}><ListTask/> Terug naar zoekresultaat</button>
{:else}
  {#if data.q && data.result.length === 0 && data.sources.length === 0 && !data.error}
  <div class="alert alert-warning" role="alert">
    <InfoCircleFill />
    Er is niets gevonden met de zoekwoorden die je opgaf. Probeer het eventueel nog een keer met andere zoekwoorden.
  </div>
  {/if}
  {#if data.error}
  <div class="alert alert-warning" role="alert">
    <ExclamationTriangleFill />
    Je zoekdopracht lijkt ongeldig, probeer het nog een keer met een andere zoekopdracht.
  </div>
  {/if}
  {#if data.result.length > 0 || data.sources.length > 0}
  <h2 class="fs-4">Resultaat van je zoekopdracht:</h2>
  <div class="row">
    <div class="col-6">
      <h3 class="fs-6">Categoriën</h3>
      {#if data.result.length === 0}
      <em>geen categoriën gevonden</em>
      {/if}
      <ol>
      {#each data.result as result}
        <li><a href="/zoek?q={data.q}&amp;zoekmethode={data.zoekmethode}&amp;titel={result.Title}">{@html result.headline_title}</a><br>{@html result.headline_description}</li>
      {/each}
      </ol>
    </div>
    <div class="col-6">
      <h3 class="fs-6">Bronnen</h3>
      {#if data.sources.length === 0}
      <em>geen bronnen gevonden</em>
      {/if}
      <ol>
      {#each data.sources as result}
        <li><a href="/gegevens/{result.Type}/{result.Slug}">{getType(result.Type)} {@html result.headline}</a></li>
      {/each}
      </ol>
    </div>
  </div>
  {/if}
  <h3 class="fs-6">Gevanceerde zoekmogelijkheden</h3>
  <ul>
    <li>Omgekeerd zoeken: <code>cultuur & !recreatie</code> (alles met <code>cultuur</code> maar zonder <code>recreatie</code>)</li>
    <li>Booleans zoeken: <code>(cultuur | sport) | recreatie</code></li>
    <li>Wildcard/Joker zoeken: <code>sp:*</code> (alles beginned met <code>sp</code>)</li>
  </ul>
{/if}

