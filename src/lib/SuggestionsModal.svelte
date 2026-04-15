<script lang="ts">
  import { onMount } from 'svelte';

  export let suggestions: {[id: string]: string[]} = {}
  export let noLinks: string[] = []
  export let bronTitle = ''
  export let onclicked: (key: string) => void
  export let onclose

  let suggestionsContainer: bootstrap.Modal
  let suggestionKey: string | undefined = undefined

  const onClickedLocal = (key: string) => {
    suggestionKey = key
    suggestionsContainer?.hide()
  }

  onMount(async () => {
  	const bootstrap = await import('bootstrap');
    suggestionsContainer = new bootstrap.Modal(document.getElementById('suggestionsContainer')!)

    document.getElementById('suggestionsContainer')?.addEventListener('hidden.bs.modal', function () {
      if (suggestionKey) {
        onclicked(suggestionKey)
      } else {
        onclose()
      }
    })

    suggestionsContainer.show()
  })
</script>
<style>
  table.suggestions {
    width: 100%;
  }
  table.suggestions th, table.suggestions td {
    padding: 2px 8px;
  }
  #suggestionsContainer .modal-footer {
    justify-content: space-between;
  }
  .smaller {font-size: 0.9rem;}
</style>
<div class="modal" tabindex="-1" id="suggestionsContainer">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Onderstaande gemeenten zijn het meest vergelijkbaar met {bronTitle}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Sluit"></button>
      </div>
      <div class="modal-body">
        <div style="width: 100%;">
          <table class="suggestions">
            <thead>
              <th>Naam</th>
              <th class="text-center">Gelijkenisscore</th>
            </thead>
            <tbody>
              {#each suggestions['Keys'] as key, index}
              <tr>
                <td>
                  {#if noLinks.includes(key)}
                  {suggestions['Gemeente'][index]}
                  {:else}
                  <a href="{'#'}" on:click|preventDefault={(ev) => onClickedLocal(key)}>
                    {suggestions['Gemeente'][index]}
                  </a>
                  {/if}
                </td>
                <td class="text-center">
                  {suggestions['SimilariteitScore'][index]}
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
          <p class="smaller mt-3">De gelijkenisscore geeft aan hoe sterk andere gemeenten lijken op {bronTitle}. Deze score is gebaseerd op
            profielvergelijking van Amigo (oriëntatie: Integraal): hoe kleiner het verschil, hoe hoger de score.</p>
        </div>
      </div>
      <div class="modal-footer">
        <span class="smaller">Bron: <a href="https://amigo.waarstaatjegemeente.nl/" target="_blank">Amigo / WaarStaatJeGemeente</a>
        </span>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Sluit</button>
      </div>
    </div>
  </div>
</div>
