<script lang="ts">
	import { onMount } from "svelte";
	import type { Bron } from "../../../../Types";
  import { enhance } from "$app/forms";
  import type { PageData } from './$types';

  export let form
  export let data: PageData

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

<style>
  #sources {
    width: 50%;
    height: 400px;
    overflow: hidden;
  }
  #sources ul li a {
    display: block;
    line-height: 2.5em;
    margin-left: 0.75rem;
  }
</style>

<h1>Overheidsgebruiker toevoegen of koppelen</h1>
<p>Als je een bestaande overheidsgebruiker wilt koppelen aan een nieuwe bron hoef je niet de Voornaam
  en Achternaam velden in te vullen; selecteren van de nieuwe bron en het invullen van het e-mailadres
  is dan voldoende.
</p>
{#if form?.success}
  <div class="alert alert-success mt-4" role="alert">
    {form?.message}
    {form?.invitationLink}
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
  <div class="form-floating mb-3">
    <input
      type="text"
      class="form-control form-control-lg"
      id="firstname"
      name="firstname"
      value={form?.data?.firstname ?? ''}
      placeholder="Voornaam&hellip;"
    />
    <label for="firstname" class="form-label">Voornaam</label>
  </div>
  <div class="form-floating mb-3">
    <input
      type="text"
      class="form-control form-control-lg"
      id="lastname"
      name="lastname"
      value={form?.data?.lastname ?? ''}
      placeholder="Achternaam&hellip;"
    />
    <label for="lastname" class="form-label">Achternaam</label>
  </div>
  <div class="form-floating mb-3">
    <input
      required
      type="email"
      class="form-control form-control-lg"
      id="email_address"
      name="email_address"
      value={form?.data?.email_address ?? ''}
      placeholder="E-mailadres&hellip;"
    />
    <label for="emai_address" class="form-label">E-mailadres</label>
  </div>
	<button type="submit" class="btn btn-primary">Toevoegen of koppelen</button>
</form>
{#if form?.error}
  <div class="alert alert-warning mt-4" role="alert">
    {form?.error}
  </div>
{/if}
