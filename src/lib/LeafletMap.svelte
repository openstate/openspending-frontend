<script>
  export let mapAction = (/** @type {HTMLDivElement} */ _e) => {}
</script>
<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"
	/>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"
	/>
</svelte:head>
<style>
	#map.loading {
		background-image: url('/images/spinner.gif');
		background-size: 200px 100%;
		background-position: left top;
		background-repeat: no-repeat;
	}
	#map {
		height: 600px
	}

</style>
<div id="map" class="loading" use:mapAction></div>
