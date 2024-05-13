<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import "../app.scss";
	import { browser } from "$app/environment";

	onMount(async () => {
		if (!browser) return;
		await import("bootstrap");
	});
	import '../app.scss';
	import Header from '../lib/Header.svelte';
	import Footer from '../lib/Footer.svelte';
</script>

<Header></Header>
<main>
	<div class="container">
		<slot />
	</div>
</main>
<Footer></Footer>

<style lang="css">
	main {
		margin-top: 120px;
		margin-bottom: 50px;
	}
</style>
