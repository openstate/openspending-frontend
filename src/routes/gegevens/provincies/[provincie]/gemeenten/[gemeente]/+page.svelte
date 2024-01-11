<script>
	export let data;
</script>

<svelte:head>
	<title>Open Spending | {data.provincie} | {data.gemeente}</title>
	<meta property="og:title" content="Open Spending | {data.provincie} | {data.gemeente}" />
</svelte:head>
<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item"><a href="/gegevens">Gegevens</a></li>
		<li class="breadcrumb-item"><a href={`/gegevens/provincies/${data.provincie}`}>{data.provincie}</a></li>
		<li class="breadcrumb-item active" aria-current="page">{data.gemeente}</li>
	</ol>
</nav>
<h1>{data.gemeente}, {data.provincie}</h1>
