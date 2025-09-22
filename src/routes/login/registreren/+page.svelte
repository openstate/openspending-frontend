<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from "$app/forms";

  export let form
  export let data: PageData
	let password = '';
	let confirmPassword = '';
  let passwordsDiffer = '';
</script>

<h1>In registreren</h1>
{#if form?.success}
  <div class="alert alert-success mt-4" role="alert">
    {form?.message}
    {#if form?.showLoginLink}
    <a href='/login'>Inloggen</a>
    {/if}
  </div>
{/if}
{#if !form?.showLoginLink}
<form class="gap-4 w-50" method="POST" use:enhance={({cancel}) => {
    if (!password || password !== confirmPassword) {
      cancel()
      passwordsDiffer = 'Wachtwoord verschilt van wachtwoord bevestiging'
    }else {
      passwordsDiffer = ''
    }
  }}>
  <div class="form-floating mb-3">
    <input
      disabled
      type="text"
      class="form-control form-control-lg"
      id="firstname"
      name="firstname"
      value={data.user?.firstname ?? ''}
    />
    <label for="firstname" class="form-label">Voornaam</label>
  </div>
  <div class="form-floating mb-3">
    <input
      disabled
      type="text"
      class="form-control form-control-lg"
      id="lastname"
      name="lastname"
      value={data.user?.lastname ?? ''}
    />
    <label for="lastname" class="form-label">Achternaam</label>
  </div>
  <div class="form-floating mb-3">
    <input
      disabled
      type="email"
      class="form-control form-control-lg"
      id="email_address"
      name="email_address"
      value={data.user?.email_address ?? ''}
    />
    <label for="emai_address" class="form-label">E-mailadres</label>
  </div>
  <div class="form-floating mb-3">
    <input
      required
      type="password"
      class="form-control form-control-lg"
      id="password"
      name="password"
      placeholder="Wachtwoord&hellip;"
      bind:value={password}
    />
    <label for="emai_address" class="form-label">Wachtwoord</label>
  </div>
  <div class="form-floating mb-3">
    <input
      required
      type="password"
      class="form-control form-control-lg"
      id="confirm_password"
      name="confirm_password"
      placeholder="Wachtwoord&hellip;"
      bind:value={confirmPassword}
    />
    <label for="emai_address" class="form-label">Wachtwoord bevestiging</label>
  ` {#if passwordsDiffer}
      <div class="alert alert-warning" role="alert">
        {passwordsDiffer}
      </div>
    {/if}
  </div>
` {#if data.user}
  <button type="submit" class="btn btn-primary">Registeren</button>
  {/if}
</form>
{/if}
{#if form?.error}
  <div class="alert alert-warning mt-4" role="alert">
    {form?.error}
  </div>
{/if}
