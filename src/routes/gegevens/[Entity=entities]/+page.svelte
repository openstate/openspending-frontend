<script lang="ts">
	import { onMount } from 'svelte';
	export let data;
  let Entity = data.Entity.replace('Regelingen', ' Regelingen')
  let q = ''
  let findSourceField: HTMLInputElement

  $: bronnen = data.bronnen.filter(bron => q === '' || bron.Title.toLowerCase().includes(q))

  onMount(() => {
    document.body.addEventListener('keyup', (ev) => {
      if(ev.key === '/') {
        findSourceField.focus()
        findSourceField.select()
      }
    })
  })
</script>
<style>
  ul li {
    padding-left: 0px;
  }
  ul li a {
    display: block;
    line-height: 2.5em;
  }

</style>

<svelte:head>
	<title>{Entity} | Open Spending</title>
	<meta property="og:title" content="{Entity} | Open Spending" />
</svelte:head>
<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item"><a href="/gegevens">Gegevens</a></li>
		<li class="breadcrumb-item active" aria-current="page"><a href={`/data/${data.Entity}`}>{Entity}</a></li>
	</ol>
</nav>
<h1>{Entity}</h1>
<div class="input-group mt-2">
  <input bind:this={findSourceField} bind:value="{q}" aria-label="Zoek" class="form-control" type="text" size="20" placeholder="zoek {Entity === 'GemeenschappelijkeRegelingen' ? 'Gem. regelingen' : Entity} &hellip;">
  <span class="input-group-text"><kbd>/</kbd></span>
</div>
<div id="Sources">
  <ul class="list-unstyled mt-3">
  {#each bronnen as bron}
    <li><a href="/gegevens/{data.Entity}/{bron.Slug}">{bron.Title}</a></li>
  {/each}
  </ul>
</div>
