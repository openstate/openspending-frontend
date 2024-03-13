<script lang="ts">
	import { onMount } from 'svelte';
	export let data;
  $: Entity = data.Entity.replace('Regelingen', ' Regelingen')
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
		<li class="breadcrumb-item active" aria-current="page"><a href={`/gegevens/${data.Entity}`}>{Entity}</a></li>
	</ol>
</nav>
<h1>{Entity}</h1>
<ul class="nav nav-underline">
  <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'Provincies'} href="/gegevens/Provincies">Provincies</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'Gemeenten'} href="/gegevens/Gemeenten">Gemeenten</a>
  </li>
  <!-- <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'Waterschappen'} href="/gegevens/Waterschappen">Waterschappen</a>
  </li> -->
  <li class="nav-item">
    <a class="nav-link" class:active={Entity === 'Gemeenschappelijke Regelingen'} href="/gegevens/GemeenschappelijkeRegelingen">Gemeenschappelijke regelingen</a>
  </li>
</ul>
<div class="input-group mt-2">
  <input bind:this={findSourceField} bind:value="{q}" aria-label="Zoek" class="form-control" type="text" size="20" placeholder={`zoek ${Entity} …`}>
  <span class="input-group-text"><kbd>/</kbd></span>
</div>
<div id="Sources">
  <div class="row mt-3">
    {#if data.Entity === 'GemeenschappelijkeRegelingen'}
      {#each bronnen as bron}
        <div class="col-lg-6 col-sm-12 col-m-12"><a href="/gegevens/{data.Entity}/{bron.Slug}">{bron.Description}</a></div>
      {/each}
    {:else}
      {#each bronnen as bron}
        <div class="col-lg-3 col-sm-12 col-m-6"><a href="/gegevens/{data.Entity}/{bron.Slug}">{bron.Title}</a></div>
      {/each}
    {/if}
  </div>
</div>
