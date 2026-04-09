<script lang="ts">
  import FeedbackForm from '$lib/forms/Feedback2026.svelte'

  import { page } from '$app/stores';
  $: capjs_site_key = $page.data.capjs_site_key
</script>

<h1>Help ons OpenSpending.nl te verbeteren en vul de poll in!</h1>
<p>Open State Foundation zet zich in voor toegankelijke financiële data en meer hergebruik van overheidsinformatie.
  Om dat nog beter te doen, zijn we benieuwd naar jouw ervaringen.
</p>
<p class='mb-5'>Wie gebruikt OpenSpending.nl, waarvoor en wat kan er beter?
  Vul de onderstaande poll in en laat het ons weten!
</p>
<FeedbackForm {capjs_site_key}></FeedbackForm>
