<script lang="ts">
  import Cap from '@cap.js/widget';
	import { onMount } from 'svelte';

  export let capjs_site_key: string
  export let token: string

  onMount(() => {
    const widget = document.querySelector("#cap");

    widget?.addEventListener("solve", function (e) {
      token = e.detail.token;
    });
  })
</script>

<cap-widget id="cap" data-cap-api-endpoint="https://capjs.openstate.eu/{capjs_site_key}"></cap-widget>