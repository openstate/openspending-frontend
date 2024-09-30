<script lang="ts">
	import { onMount } from 'svelte';
	import { CheckCircleFill, ExclamationCircleFill } from 'svelte-bootstrap-icons';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { loginEnabled } from '../../stores.js';
  $: session = $page.data.session;
  export let form;
  let expired: boolean = false
  onMount(() => {
    if (window.location.search.includes('noAdmin')) document.getElementById('noAdmin')?.classList.remove('d-none')
    Array.from(document.querySelectorAll('.form-control')).forEach(
			(input) => ((input as HTMLFormElement).name = input.id)
		);
    if (form?.success === true) {
      setTimeout(() => {
        window.location.replace('/')
      }, 1500)
    }
    // @ts-ignore
    console.log(window.location.search)
    expired = window.location.search.includes('expired')
  })
</script>
<div class="row">
  <div class="col-sm-12 col-md-10 col-lg-8 col-xl-8">
{#if get(loginEnabled) !== 'true'}
  <h1>Login niet beschikbaar</h1>
  <p class="lead">De gegevens op deze website zijn openbaar, u hoeft dus niet in te loggen.</p>
{:else}
{#if session?.Token}
<!-- <pre>{JSON.stringify(session, null, 2)}</pre> -->
<h1>Afmelden</h1>
{#if form !== null}
  {#if form.success === false}
    <div class="alert alert-warning" role="alert">
      <ExclamationCircleFill/>
      {form?.message}
    </div>
  {:else}
  
    <div class="alert alert-success">
      <p class="fw-bold">
        <CheckCircleFill/>
        U bent succesvol ingelogd, u wordt doorgestuurd naar onze website.
      </p>
    </div>
  {/if}
{/if}
<div class="alert alert-warning d-none" id="noAdmin">
    <ExclamationCircleFill/>
    Voor deze pagina moet je zijn ingelogd as beheerder. Neem contact op met Open State als je deze toegang nodig hebt.
</div>
<p class="lead">U bent momenteel ingelogd, klik op de knop hieronder om uit te loggen.</p>
<form method="post" action="/uitloggen">
  <button class="btn btn-primary">Uitloggen</button>
</form>
{:else}
<h1>Login</h1>
  {#if expired}
    <div class="alert alert-warning" role="alert">
      <ExclamationCircleFill/>
      Uw sessie is verlopen, u dient opnieuw in te loggen.
    </div>
  {/if}
    <p class="lead">Om toegang te krijgen tot de Openspending website dient u in te loggen met de gegevens die u van ons heeft ontvangen.</p>
    <form method="POST" action="/login">
      {#if form !== null}
        {#if form.success === false}
          <div class="alert alert-warning" role="alert">
            <ExclamationCircleFill/>
            {form?.message}
          </div>
        {:else}
        
          <div class="alert alert-success">
            <p class="fw-bold">
              <CheckCircleFill/>
              U bent succesvol ingelogd, u wordt doorgestuurd naar onze website.
            </p>
          </div>
        {/if}
      {/if}
      <div class="row mb-2">
        <label for="email" class="form-label col-sm-3">Gebruikersnaam</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="username">
        </div>
        <label for="wachtwoord" class="form-label col-sm-2 text-end">Wachtwoord</label>
        <div class="col-sm-3">
          <input type="password" class="form-control" id="wachtwoord">
        </div>
      </div>
      <div class="row mb-3">
        <div class="form-label col-sm-3">&nbsp;</div>
        <div class="col-sm-2">
          <button type="submit" class="btn btn-primary">Inloggen</button>
        </div>
      </div>
    </form>
  {/if}
{/if}
  </div>
</div>