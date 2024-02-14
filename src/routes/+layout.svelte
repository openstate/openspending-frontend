<script>
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
