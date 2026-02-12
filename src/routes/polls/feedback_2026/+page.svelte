<script lang="ts">
  import FeedbackForm from '$lib/forms/Feedback2026.svelte'

  import { page } from '$app/stores';
  $: capjs_site_key = $page.data.capjs_site_key
</script>

<h1>Poll</h1>
<p>Inleidende tekst</p>
<FeedbackForm {capjs_site_key}></FeedbackForm>
