<script lang="ts">
	import { onMount } from 'svelte';
	import { Floppy } from 'svelte-bootstrap-icons';
  import { get } from 'svelte/store'
	import { api } from '../../../stores.js';
  import { page } from '$app/stores';
  $: session = $page.data.session;  export let data
  let saveButton: HTMLButtonElement
  let checkboxes: HTMLInputElement[] = []

  const toggle = (checked: boolean) => {
    checkboxes.forEach(b => b.checked=checked)
    saveButton.disabled = !checkboxes.some(b => b.checked)
  }
  let showInfo = false

  onMount(() => {
    checkboxes = Array.from(document.querySelectorAll<HTMLInputElement>('tbody>tr>th>input[type="checkbox"]'))
    checkboxes.forEach(box => {
      box.onchange = () => {
        saveButton.disabled = !checkboxes.some(box => box.checked)
      }
    })
  })

  const save = () => {
    if (!checkboxes.some(box => box.checked)) {
      alert('Selecteer eerst één of meerdere datasets.')
    } else {
      showInfo = true
      const publish = checkboxes.filter(box => box.checked).map(box => {
        return box.dataset
      })
      fetch(`${get(api)}/admin/detaildata/publiceer`, {
        method: 'POST',
        headers: [
          ['content-type', 'application/json'],
          ['authorization', `Bearer: ${session.Token}`]
        ],
        body: JSON.stringify(publish)
      }).then(res => {
        if (!res.ok) {
          throw new Error(`Kon data niet opslaan (API fout ${res.status} ${res.statusText})`)
        }
        return res.json()
      })
      .then(bronnen => {
        data.bronnen = bronnen
        toggle(false)
        setTimeout(() => showInfo = false, 2000)
      })
      .catch(e => {
        alert(`Er is iets misgegaan:\n${(e as Error).message}`)
      })
    }
  }
</script>
<h1>Publiceer datasets met detaildata</h1>
<div class="row">
  <div class="col-sm-12 col-md-10 col-lg-9 col-xl-7">
    <div class="alert alert-warning" class:d-none={data.bronnen.length > 0}>
      Er zijn momenteel geen detaildata die niet gepubliceerd zijn.
    </div>
    <p class="lead" class:d-none={data.bronnen.length === 0}>Onderstaande datasets hebben wél detaildata, maar zijn nog niet gepubliceerd. 
      <br>Vink de datasets aan die je gepubliceerd wilt hebben en klik op "Opslaan".
    </p>
    <div class="alert alert-info" class:d-none={showInfo === false}>
      De wijzgingen zijn succesvol opgeslagen.
    </div>
  </div>
</div>

<div class="row" class:d-none={data.bronnen.length === 0}>
  <div class="col-sm-12 col-md-10 col-lg-8 col-xl-6">
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th><input type="checkbox" on:click={(e) => toggle(e.currentTarget.checked)}></th>
          <th>Bron</th>
          <th>Organisatie</th>
          <th>Jaar</th>
        </tr>
      </thead>
      <tbody>
        {#each data.bronnen as bron}
          <tr>
            <th scope="row"><input type="checkbox" data-workspace={bron.Workspace} data-key={bron.Key}></th>
            <td>{bron.Type}</td>
            <td><a href="/gegevens/{bron.Type}/per/hoofdfunctie/{bron.Slug}/{bron.Period}/begroting">{bron.Title}</a></td>
            <td>{bron.Period}</td>
          </tr>
        {/each}
        <tr></tr>
      </tbody>
    </table>
    <button disabled bind:this={saveButton} class="btn btn-primary btn-lg" on:click|preventDefault={save}><Floppy/> Opslaan</button>
  </div>
</div>
