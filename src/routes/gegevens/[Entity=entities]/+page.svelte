<script>
	import SourcesOnMap from '$lib/SourcesOnMap.svelte';
  export let data
</script>
<h1>Open Spending</h1>
<p class="lead">
	Bekijk en vergelijk de huishoudboekjes van lokale overheden.
</p>
<SourcesOnMap Entity={data.entity}/>