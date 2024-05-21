<script>
// @ts-nocheck

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
</script>

<OpenstateBar />
<Header />
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
