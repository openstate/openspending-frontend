<script lang="ts">
	import { page } from '$app/stores';
  export let data
  
</script>
<svelte:head>
	<title>Organisaties met detaildata | Open Spending</title>
	<meta property="og:title" content="Organisaties met detaildata | Open Spending" />
</svelte:head>
<h1>Organisaties met detaildata</h1>
<div class="rows">
  <div class="com-sm-12 col-md-12 col-lg-9">
    <p class="lead">
      Momenteel bevat Open Spending de <em><a href="https://www.rijksoverheid.nl/onderwerpen/financien-gemeenten-en-provincies/uitwisseling-financiele-gegevens-met-sisa-en-iv3/informatie-voor-derden-iv3" target="_blank">Informatie voor Derden</a></em> (Iv3) die organisaties verplicht aanleveren aan het CBS.
      Steeds meer organisaties gaan een stap verder en leveren ook zogenaamde "detaildata" aan. 
      Deze detaildata zorgt voor nog meer financiële transparantie op lokaal niveau en dus jouw eigen leefomgeving.
      Omdat niet alle organisaties nog detaildata aanleveren, kun je op deze pagina zien welke organisaties dat wel al doen.
    </p>
  </div>
  {#if data.bronnen.length === 0}
  <div class="alert alert-info">
    Er is momenteel geen detaildata beschikbaar gesteld. Dat kan binnenkort veranderen, houd deze pagina dus in de gaten. 
    <br>Je kunt jouw gemeente natuurlijk altijd vragen of ze hun Iv3 detaildata aan OpenSpending.nl kunnen aanleveren zodat we die hier ook kunnen publiceren.
  </div>
  {:else}
  <div class="com-sm-12 col-md-12 col-lg-9">
    <h2>Gemeentes</h2>
    <table class="table table-hover caption-top table-bordered">
      <thead>
        <tr>
          <th>Naam</th>
          <th>Jaren</th>
        </tr>
      </thead>
      <tbody>
        {#each data.bronnen as bron}
        <tr>
          <!-- <td><a href="/gegevens/${bron.SourceType}/{bron.Slug}">{bron.Source}</a></td> -->
          <td>{bron.Source}</td>
          <td>{@html bron.Jaren.map((jaar, index) => { return `<a href="/gegevens/${bron.SourceType}/details/${bron.Slug}/${bron.Workspaces[index]}">${jaar}</a>`}).join(', ')}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {/if}
</div>
