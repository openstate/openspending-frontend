<script>
	import Header from '../lib/Header.svelte';
	import Footer from '../lib/Footer.svelte';
</script>

<Header />
<main>
	<div class="container">
		<slot />
	</div>
</main>
<Footer />

<style lang="css">
	main {
		margin-top: 120px;
		margin-bottom: 50px;
	}
</style>
