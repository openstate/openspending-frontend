<script lang="ts">
	import { onMount } from 'svelte';
	import type { Source } from '../../Types';
  import { api } from '../../stores.js'
  let Entity = 'Provincies'

  let sources: Source[] = []
  let filteredSources: Source[] = []
  let error: Error | undefined
  let findSourceField: HTMLInputElement

  const setEntity = (event: Event) => {
    Entity = (event.target as HTMLAnchorElement).dataset.entity ?? 'Provincies';
    load()
  }
  const load = () => {
    fetch(`${$api}/bronnen/${Entity}`)
      .then(response => {
        if (!response.ok) throw new Error(`Kan de bronnen niet laden: ${response.statusText}`)
        return response.json()
      })
      .then($sources => {
        sources = $sources
        filteredSources = [...sources]
        findSourceField.value = ''
      }).catch(e => {
        error = e
      })
	};
  onMount(() => {
    findSourceField = document.getElementById('find-source') as HTMLInputElement
    document.body.addEventListener('keyup', (ev) => {
      if(ev.key === '/') {
        findSourceField.focus()
        findSourceField.select()
      }
    })
    findSourceField.addEventListener('keyup', (ev) => {
      const q = findSourceField.value
      if (q!=='') filteredSources = sources.filter(source => source.Title.toLowerCase().includes(q.toLowerCase()))
      else filteredSources = [...sources]
    })
    load()
  })

</script>
<style>
  ul li {
    padding-left: 0px;
  }
  ul li a {
    display: block;
    line-height: 2.5em;
  }

</style>
<h1>Open Spending</h1>
<p class="lead">
	Bekijk en vergelijk de huishoudboekjes van lokale overheden.
</p>

<ul class="nav nav-underline">
  <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'Provincies'} on:click={setEntity} data-entity="Provincies" href={'#'}>Provincies</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'Gemeenten'} on:click={setEntity} data-entity="Gemeenten" href={'#'}>Gemeenten</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'Waterschappen'} on:click={setEntity} data-entity="Waterschappen" href={'#'}>Waterschappen</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'GemeenschappelijkeRegelingen'} on:click={setEntity} data-entity="GemeenschappelijkeRegelingen" href={'#'}>Gemeenschappelijke regelingen</a>
  </li>
  <li class="nav-item">
    <div class="input-group mt-2">
      <input id="find-source" aria-label="Zoek" class="form-control" type="text" size="20" placeholder="zoek {Entity === 'GemeenschappelijkeRegelingen' ? 'Gem. regelingen' : Entity} &hellip;">
      <span class="input-group-text"><kbd>/</kbd></span>
    </div>
  </li>
</ul>
<div id="Sources">
  <ul class="list-unstyled mt-3">
  {#each filteredSources as source}
    <li><a href="/gegevens/{Entity}/{source.Slug}">{source.Title}</a></li>
  {/each}
  </ul>
</div>
{#if error !== undefined}
  <div class="alert alert-warning" role="alert">
    {error.message}
  </div>
{/if}
