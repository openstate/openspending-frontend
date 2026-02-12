<script lang="ts">
  import { onMount } from 'svelte';
  import SelectWithOther from '$lib/form_components/SelectWithOther.svelte'
  import OpenQuestion from '$lib/form_components/OpenQuestion.svelte';
  import { submitForm } from '../../utils';
  import CapWidget from '$lib/form_components/CapWidget.svelte';
	import type { FormQuestionType } from '../../Types';

  export let capjs_site_key: string

  let loader: bootstrap.Modal;
  let capToken: string
  let errorMessage: string | undefined
  let successMessage: string | undefined
  let questions: FormQuestionType[] = [
    {number: 1, answer: undefined, valid: false, validate: undefined},
    {number: 2, answer: undefined, valid: false, validate: undefined},
    {number: 3, answer: undefined, valid: false, validate: undefined}
  ]

  const handleClick = async (event) => {
    loader.show()
    const result = await submitForm(event, questions, capToken)
    if (result.valid && result.success) {
      errorMessage = undefined
      successMessage = "Hartelijk dank voor uw feedback! Indien u uw e-mailadres heeft opgegeven zullen wij contact met u opnemen."
    } else {
      successMessage = undefined
      if (!result.valid) {
        errorMessage = "Niet alle velden zijn goed ingevuld of ontbreken, deze zijn hieronder met rood aangegeven."
      } else {
        errorMessage = result.message
      }
    }
    loader.hide()
  }

  onMount(async () => {
    const bootstrap = await import('bootstrap');
    loader = new bootstrap.Modal(document.getElementById('loading')!)
  })
</script>

<div class="modal modal-fullscreen" data-bs-backdrop="static" data-bs-keyboard="false" id="loading">
  <div class="modal-dialog">
	  <div class="d-flex justify-content-center" style="margin-top: 400px;">
		  <div class="spinner-border text-light" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</div>
<form class="os-form" method="POST" on:submit={handleClick}>
  {#if errorMessage}
  <div class='alert alert-danger'>{errorMessage}</div>
  {/if}
  {#if successMessage}
  <div class='alert alert-success'>{successMessage}</div>
  {/if}
  <SelectWithOther
    question="Ik gebruik OpenSpending als"
    questionRequired={true}
    items={["Burger", "Journalist", "Ambtenaar", "Wetenschapper", "Anders"]}
    bind:selected={questions[0].answer}
    bind:valid={questions[0].valid}
    bind:validate={questions[0].validate}
    otherOption="Anders"
    other_placeholder="Graag invullen..."
  />
  <OpenQuestion
    question="Heeft u suggesties of opmerkingen?"
    bind:answer={questions[1].answer}
    bind:valid={questions[1].valid}
    bind:validate={questions[1].validate}
    placeholder="Optioneel"
    numberOfLines={5}
  />
  <OpenQuestion
    question="Ik denk graag mee over bestaande en nieuwe functionaliteit van OpenSpending.
    Door mijn e-mailadres op te geven geef ik toestemming aan OpenState om mij hierover te benaderen."
    bind:answer={questions[2].answer}
    bind:valid={questions[2].valid}
    bind:validate={questions[2].validate}
    placeholder="Mijn e-mailadres (optioneel)"
  />
  <p class="mb-3"><small><span class="required">*</span> Verplicht veld</small></p>
  <CapWidget bind:token={capToken} {capjs_site_key} />
	<button type="submit" class="btn btn-primary"  disabled={!capToken}>Verstuur</button>
</form>