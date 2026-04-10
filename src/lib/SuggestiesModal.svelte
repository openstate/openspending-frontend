<script lang="ts">
  export let suggesties: {[id: string]: string[]} = {}
  export let bronTitle = ''
</script>
<style>
  .os-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    background-color: rgba(0,0,0,0.4); 
  }
  .os-modal-content {
    margin: 15% auto;
    width: 40%;
    border: 1px solid #888;
    background-color: #fefefe;
  }
</style>
<div role="dialog" aria-modal="true" class="os-modal">
  <div class="os-modal-content">
    <h1>Suggesties</h1>
    <p>Onderstaande gemeenten zijn volgens Amigo het meest vergelijkbaar met {bronTitle}</p>
    <table>
      <tbody>
        {#each suggesties['CBS_ID'] as _suggestie, index}
        <tr>
          <td>
            {suggesties['Gemeente'][index]}
          </td>
          <td>
            {suggesties['SimilariteitScore'][index]}
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>