<script lang="ts">
  import { enhance } from "$app/forms";

  export let data
  export let form
</script>

<h1>Overheidsgebruiker verwijderen</h1>
<p><strong>De gebruiker zal hierna niet meer kunnen inloggen en dus geen toegang meer hebben tot de gekoppelde bron(nen).</strong></p>
<p>Weet je zeker dat je de volgende overheidsgebruiker wilt verwijderen?</p>

{#if data.user}
  <p class="lead">
    {data.user.Firstname} {data.user.Lastname}<br/>
    {data.user.Username}<br/>
    {data.user.Sources.map((source) => source.Title).join(", ")}
  </p>
{/if}
{#if form?.success}
  <div class="alert alert-success mt-4" role="alert">
    {form?.message}
  </div>
{:else}
  <form method="post" use:enhance>
    <button type="submit" class="btn btn-primary">Verwijderen</button>
  </form>
{/if}
{#if form?.error}
  <div class="alert alert-warning mt-4" role="alert">
    {form?.error}
  </div>
{/if}
