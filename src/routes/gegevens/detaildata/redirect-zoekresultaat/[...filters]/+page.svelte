<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

  export let data
  onMount(() => {
    goto(data.path)
  })
</script>
<a target="_blank" href="{data.path}">Ga naar zoekresultaat &hellip;</a>