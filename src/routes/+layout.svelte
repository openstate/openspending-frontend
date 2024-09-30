<script>

  import { get } from 'svelte/store';
  import { page } from '$app/stores';
	import { onMount } from "svelte";
	import "../app.scss";
	import { browser } from "$app/environment";

	onMount(async () => {
		if (!browser) return;
		await import("bootstrap");
	});
	import Header from '../lib/Header.svelte';
	import Footer from '../lib/Footer.svelte';
	import OpenstateBar from '$lib/OpenstateBar.svelte';
	import { loginEnabled } from '../stores';
  $: session = $page.data.session;
</script>

<OpenstateBar />

{#if get(loginEnabled) === 'false' || session.Token}
<Header />
{/if}

<main>
	<div class="container">
		<slot />
	</div>
</main>
<Footer></Footer>

<style lang="css">
	main {
		margin-top: 160px;
		margin-bottom: 100px;
	}
</style>
