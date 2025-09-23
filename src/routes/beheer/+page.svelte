<script lang="ts">
  import { page } from '$app/stores';
  $: session = $page.data.session
</script>

<h1>Beheerstaken</h1>
<ul class="spaced">
  <li><a href="/beheer/publicatie-detaildata">Publiceer detaildata</a></li>
  {#if session.Role === 'admin'}
  <li><a href="/beheer/overheidsgebruikers">Beheer overheidsgebruikers</a></li>
  {/if}
</ul>