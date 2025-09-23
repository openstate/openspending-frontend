<script lang="ts">
	import { onMount } from "svelte";
  import { enhance } from "$app/forms";
	import type { Bron } from "../../../../../Types.js";

  export let data
  export let form

  let findSourceField: HTMLInputElement
  let sourceField: HTMLInputElement
  let sourcesField: HTMLElement
  let filteredSources: Bron[] = data.sources

  const bronTitle = (source: Bron) => {
    return source.Title.replace(' (PV)', '')
  }

  const setSource = (source: Bron) => {
    findSourceField.value = bronTitle(source)
    sourceField.value = source.Key
    sourcesField.classList.remove('searching')
  }

  onMount(async () => {
    findSourceField = document.getElementById('find_source') as HTMLInputElement
    sourceField = document.getElementById('source') as HTMLInputElement
    sourcesField = document.getElementById('sources') as HTMLElement

    document.body.addEventListener('keydown', (ev) => {
      // @ts-ignore
      if (ev.target?.tagName.toUpperCase() == 'INPUT') return
      if(ev.key === '/') {
        ev.preventDefault()
        findSourceField.focus()
        findSourceField.select()
      }
    })

    findSourceField.addEventListener('keyup', (ev) => {
      const q = findSourceField.value
      if (q!=='') filteredSources = data.sources
        .filter(source => source.Title.toLowerCase().includes(q.toLowerCase()))
      else filteredSources = [...data.sources]
    })

    findSourceField.addEventListener('focus', (ev) => {
      sourcesField.classList.add('searching')
    })
  })
</script>
<h1>Koppel gebruiker aan nieuwe bron</h1>
<p class="lead">
  {data.user.Firstname} {data.user.Lastname}<br/>
  {data.user.Username}<br/>
  {data.user.Sources.map((source) => source.Title).join(", ")}
</p>
{#if form?.success}
  <div class="alert alert-success mt-4" role="alert">
    {form?.message}
  </div>
{/if}
<form class="gap-4 w-50" method="POST" use:enhance>
  <input type='hidden' id='source' name='source'/>
  <div class="form-floating mb-3">
    <input
      required
      id="find_source"
      name="find_source"
      aria-label="Zoek"
      class="form-control"
      type="text" size="20"
      placeholder="Zoek gemeente &hellip;">
      <label for="find_source" class="form-label">Zoek gemeente</label>
  </div>
  <div class="show-when-searching" id="sources">
    <ul class="list-unstyled mt-3" style="height: 640px; overflow: scroll;">
    {#each filteredSources as source}
      <li><a 
        on:click|preventDefault|stopPropagation={() => {setSource(source)}}
        href={'#'}>{bronTitle(source)}
        </a></li>
    {/each}
    </ul>
  </div>
	<button type="submit" class="btn btn-primary">Koppelen</button>
</form>
{#if form?.error}
  <div class="alert alert-warning mt-4" role="alert">
    {form?.error}
  </div>
{/if}
