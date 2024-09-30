<script lang="ts">
	import { onMount } from 'svelte';
  import { page } from '$app/stores';
	import { ExclamationCircleFill } from 'svelte-bootstrap-icons';
  $: session = $page.data.session;
  export let form;
  onMount(() => {
    Array.from(document.querySelectorAll('.form-control')).forEach(
			(input) => ((input as HTMLFormElement).name = input.id)
		);
    if (form?.success === true) {
      setTimeout(() => {
        window.location.replace('/uitloggen')
      }, 1500)
    }
  })
</script>
<!-- <pre>{JSON.stringify(form, null, 2)}</pre>
<code>{form?.success}</code>
<pre>{JSON.stringify(session, null, 2)}</pre> -->
{#if session?.Token && form === null}
<h1>Afmelden</h1>
<p class="lead">U bent momenteel ingelogd, klik op de knop hieronder om uit te loggen.</p>
<form method="post" action="/uitloggen">
  <button class="btn btn-primary">Uitloggen</button>
</form>
{:else}
  {#if form?.success === false}
    <h1>Uitgelogd mislukt</h1>
    <div class="alert alert-warning" role="alert">
      <p><ExclamationCircleFill/> Het is niet geluk om uit te loggen.</p>
      <code>Technische reden: {form?.reason}</code>
    </div>
  {:else}
  <h1>Uitgelogd</h1>
  <p class="lead">U bent nu uitgelogd en heeft geen toegang meer tot deze website.</p>
  <a href="/login" class="btn btn-primary">Opnieuw inloggen</a>
  {/if}
{/if}