<script lang="ts">
	import { onMount } from 'svelte';
	import type { Source } from '../../../Types.js';
  import { api } from '../../../stores.js'

	export let data;
  let Entity = data.Entity.replace('Regelingen', ' Regelingen')
  let sources: Source[] = []
  let filteredSources: Source[] = []
  let error: Error | undefined
  let findSourceField: HTMLInputElement

  onMount(() => {
    findSourceField = document.getElementById('find-source') as HTMLInputElement
    fetch(`${$api}/sources/${data.Entity}`)
      .then(response => {
        if (!response.ok) throw new Error(`Kan de bron ${data.Entity} niet laden: ${response.statusText}`)
        return response.json()
      })
      .then($sources => {
        sources = $sources
        filteredSources = [...sources]
        // findSourceField.value = ''
      }).catch(e => {
        error = e
      })

      document.body.addEventListener('keyup', (ev) => {
        if(ev.key === '/') {
          findSourceField.focus()
          findSourceField.select()
        }
      })
      findSourceField.addEventListener('keyup', () => {
        const q = findSourceField.value
        if (q!=='') filteredSources = sources.filter(source => source.Title.toLowerCase().includes(q.toLowerCase()))
        else filteredSources = [...sources]
      })
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

<svelte:head>
	<title>Open Spending | {Entity}</title>
	<meta property="og:title" content="Open Spending | {Entity}" />
</svelte:head>
<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item"><a href="/data">Gegevens</a></li>
		<li class="breadcrumb-item active" aria-current="page"><a href={`/data/${data.Entity}`}>{Entity}</a></li>
	</ol>
</nav>
<h1>{Entity}</h1>
    <div class="input-group mt-2">
      <input id="find-source" aria-label="Zoek" class="form-control" type="text" size="20" placeholder="zoek {Entity === 'GemeenschappelijkeRegelingen' ? 'Gem. regelingen' : Entity} &hellip;">
      <span class="input-group-text"><kbd>/</kbd></span>
    </div>

<div id="Sources">
  <ul class="list-unstyled mt-3">
  {#each filteredSources as source}
    <li><a href="/gegevens/{data.Entity}/{source.Slug}">{source.Title}</a></li>
  {/each}
  </ul>
</div>
{#if error !== undefined}
  <div class="alert alert-warning" role="alert">
    {error.message}
  </div>
{/if}
