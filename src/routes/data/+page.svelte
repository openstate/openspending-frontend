<script lang="ts">
import { onMount } from 'svelte';
export let data
onMount(async () => {
  for (const el of Array.from(document.querySelectorAll('.d-none')))
    el.classList.remove('d-none')
})  
</script>
<div class="row">
	<div class="col col-sm-12 col-md-12 col-lg-9 d-none">
    <h1>{data.Titel}</h1>
    <p class="lead">{@html data.Inleiding}</p>
    {@html data.Inhoud}
    <!--
		<h2>Detaildata</h2>
		<p>
			We’re also publishing financial data on a more detailed level in cooperation with several
			government bodies, so-called ‘detaildata’. See this example for the <a
				href="https://openspending.nl/groningen-gemeente/begroting/2016/lasten/hoofdfuncties/#tab-details"
				>detaildata of the municipality Groningen</a
			>
			(click on the ‘Detail Data’ tab). Read the posts regarding the detaildata of both the
			<a
				href="https://blog.openspending.nl/2016/01/15/groningen-pionier-bij-het-vrijgeven-van-financien-op-detailniveau/"
				target="_blank"
				rel="noopener">province Groningen and the municipality Groningen</a
			>
			(Dutch) or this post on the detaildata of the
			<a
				href="https://openstate.eu/en/2016/03/five-dutch-municipalities-release-detailed-openspending-data/"
				target="_blank"
				rel="noopener">municipalities of Dordrecht, Heerlen, Lelystad, Oirschot and Utrecht</a
			>. This detaildata can be found here in a
			<a
				href="https://blog.openspending.nl/wp-content/uploads/sites/5/2016/03/Detaildata-gemeenten-24-maart-2017.zip"
				rel="noopener noreferrer">ZIP file</a
			>. You can also access this data through our API, see the section below.
		</p>
    -->
	</div>
</div>
