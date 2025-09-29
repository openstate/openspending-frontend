<script lang="ts">
  import { enhance } from "$app/forms";

  export let data
  export let form
</script>

<h1>Overheidsgebruiker ontkoppelen</h1>
<p><strong>De gebruiker zal hierna geen toegang meer hebben tot onderstaande bron.</strong></p>
<p>Weet je zeker dat je de overheidsgebruiker van de volgende bron wilt ontkoppelen?</p>

{#if data.source}
  <p class="lead">
    {data.user.Firstname} {data.user.Lastname}<br/>
    {data.user.Username}<br/>
    {data.source.Title}
  </p>
{/if}
{#if form?.success}
  <div class="alert alert-success mt-4" role="alert">
    {form?.message}
  </div>
{:else}
  <form method="post" use:enhance>
    <button type="submit" class="btn btn-primary">Ontkoppelen</button>
  </form>
{/if}
{#if form?.error}
  <div class="alert alert-warning mt-4" role="alert">
    {form?.error}
  </div>
{/if}
