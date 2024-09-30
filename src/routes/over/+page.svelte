<script lang="ts">

  import OGPAward from '$lib/assets/ogp-award.jpg'
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
    <div style="border: solid 1px; width: 642px; height: 362px;" class="mb-2">
      <iframe
        title="Openspending Detail Data promotievideo (ondertiteld)"
        src="https://player.vimeo.com/video/187251141?h=4c8e45f611&color=ffffff&title=0&byline=0&portrait=0"
        width="640"
        height="360"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>

    <div class="card mt-3 mb-3" style="width: 18rem; padding: 10px;">
      <img src="{OGPAward}" style="width: 100%;" alt="Logo Open Government Award" class="card-img-top">
      <div class="card-body">
        <p class="card-text text-center">Winnaar van de <br><a href="https://www.opengovawards.org/2016Results">Open Government Award</a> honorable mention!</p>
      </div>
    </div>
    {@html data.Inhoud}
  </div>
</div>

