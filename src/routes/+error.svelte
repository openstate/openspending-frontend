<script lang="ts">
	import { page } from '$app/stores';
  // import { goto } from '$app/navigation';

	import { onMount } from 'svelte';
  onMount(() => {
    const path = window.location.pathname.split('/').filter(p => p)
    if (path[0].startsWith('provincie-')) {
      // return goto(`/gegevens/Provincies/per/hoofdfunctie/${path[0].replace('provincie-', '')}-pv/2024/begroting`)
    }
    
  })
</script>
<!-- <pre>{JSON.stringify($page, null, 2)}</pre> -->

{#if $page.status === 404}
<h1>Pagina niet gevonden</h1>
<div class="row">
  <div class="col col-sm-12 col-lg-9 col-md-12">
    <p class="lead">
      Zoals je kunt zien is Open Spending vernieuwd. Het kan daarom zijn dat oude webadressen en/of bookmarks niet meer werken.
      We raden je aan om via de navigatie in het menu opnieuw  de gegevens te vinden die je zoekt en je eventuele bookmarks aan te passen.
    </p>
    <p class="lead">
      Onze excuses voor het ongemak!
    </p>
  </div>

</div>
{:else}
<h1>Er is een fout opgetreden</h1>
<p class="lead">Er is helaas iets fout gegaan, probeert u het later nogmaals.</p>
<div class="alert alert-warning" role="alert">
  <code>{$page.status}: {$page.error?.message}</code>
</div>
{/if}
