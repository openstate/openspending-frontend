<script lang="ts">
  import { onMount } from 'svelte';

  export let suggesties: {[id: string]: string[]} = {}
  export let bronTitle = ''
  export let onclose

  let suggestionsContainer: bootstrap.Modal

  onMount(async () => {
  	const bootstrap = await import('bootstrap');
    suggestionsContainer = new bootstrap.Modal(document.getElementById('suggestionsContainer')!)

    document.getElementById('suggestionsContainer')?.addEventListener('hidden.bs.modal', function () {
      onclose()
    })

    suggestionsContainer.show()
  })
</script>
<style>
  table.suggestions th, table.suggestions td {
    padding: 2px 8px;
  }
  #suggestionsContainer .modal-footer {
    justify-content: space-between;
  }
  .smaller {font-size: 0.8rem;}
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
              <th>SimilariteitScore</th>
            </thead>
            <tbody>
              {#each suggesties['CBS_ID'] as _suggestie, index}
              <tr>
                <td>
                  {suggesties['Gemeente'][index]}
                </td>
                <td class="text-center">
                  {suggesties['SimilariteitScore'][index]}
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <span class="smaller">Bron: <a href="https://amigo.waarstaatjegemeente.nl/" target="_blank">Amigo</a>
        </span>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Sluit</button>
      </div>
    </div>
  </div>
</div>
