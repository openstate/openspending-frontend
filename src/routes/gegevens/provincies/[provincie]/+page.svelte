<script>
	export let data;
</script>

<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item"><a href="/gegevens">Gegevens</a></li>
		<li class="breadcrumb-item" aria-current="page">{data.provincie}</li>
	</ol>
</nav>

<h1>{data.provincie}</h1>
