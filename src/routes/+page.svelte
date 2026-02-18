<script>
  import { page } from '$app/stores';
  $: session = $page.data.session;
	import SourcesOnMap from '$lib/SourcesOnMap.svelte';
</script>
{#if session.Role == 'admin'}
<div class="float-end d-flex flex-column">
	<p>Help je ons de site te verbeteren?</p>
	<a href="/polls/feedback_2026" class="btn btn-primary btn-lg">Doe de poll!<br>duur: 3m</a>
</div>
{/if}
<h1>Open Spending</h1>
<p class="lead">
	Bekijk en vergelijk de huishoudboekjes van lokale overheden.
</p>
<SourcesOnMap Entity='Gemeenten'/>