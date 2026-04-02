<script lang="ts">
  import { onMount } from 'svelte';
  import SelectWithSubOptions from '$lib/form_components/SelectWithSubOptions.svelte'
  import OpenQuestion from '$lib/form_components/OpenQuestion.svelte';
  import { createResponse, submitForm } from '../../utils';
  import CapWidget from '$lib/form_components/CapWidget.svelte';
	import TextInput from '$lib/form_components/TextInput.svelte';

  export let capjs_site_key: string

  let loader: bootstrap.Modal;
  let capToken: string
  let errorMessage: string | undefined
  let successMessage: string | undefined

  let usageResponse = createResponse(1)
  let resultResponse = createResponse(2)
  let remarksResponse = createResponse(3)
  let nameResponse = createResponse(4)
  let emailResponse = createResponse(5)
  let questions = [
    usageResponse,
    resultResponse,
    remarksResponse,
    nameResponse,
    emailResponse
  ]

  const handleClick = async (event) => {
    loader.show()
    const result = await submitForm('/polls/feedback_2026', event, questions, capToken)
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
  {#if !successMessage}
    <SelectWithSubOptions
      question="Ik gebruik OpenSpending als"
      questionRequired={true}
      items={["Burger", "Journalist", "Ambtenaar", "Wetenschapper", "Anders"]}
      subItemsTitle = "Werkzaam bij:"
      subItems = {{
        Ambtenaar: ["Gemeente", "Provincie", "Waterschap", "Gemeenschappelijke regeling", "Rijksoverheid", "Anders"]
      }}
      subTextinputs = {{
        Anders: "Graag invullen..."
      }}
      bind:selected={usageResponse.answer}
      bind:valid={usageResponse.valid}
      bind:validate={usageResponse.validate}
      bind:clear={usageResponse.clear}
    />
    <SelectWithSubOptions
      question="Heeft u gevonden wat u zocht?"
      questionRequired={true}
      items={["Ja", "Nee", "n.v.t."]}
      subTextinputs = {{
        Ja: "Hoe heeft u het kunnen gebruiken?",
        Nee: "Geef een beschrijving wat u zocht"
      }}
      bind:selected={resultResponse.answer}
      bind:valid={resultResponse.valid}
      bind:validate={resultResponse.validate}
      bind:clear={resultResponse.clear}
    />
    <OpenQuestion
      question="Heeft u verdere suggesties of opmerkingen?"
      bind:answer={remarksResponse.answer}
      bind:valid={remarksResponse.valid}
      bind:validate={remarksResponse.validate}
      bind:clear={remarksResponse.clear}
      placeholder="Optioneel"
      numberOfLines={5}
    />
    <div class="form-component">
      <p class="fw-bold">
        Ik denk graag mee over bestaande en nieuwe functionaliteit van OpenSpending.
        Door mijn naam en e-mailadres op te geven geef ik toestemming aan OpenState om mij hierover te benaderen.
      </p>
      <div class="d-flex">
        <TextInput
          id="naam"
          question="Mijn naam"
          placeholder="Optioneel"
          css="me-4"
          bind:answer={nameResponse.answer}
          bind:valid={nameResponse.valid}
          bind:validate={nameResponse.validate}
          bind:clear={nameResponse.clear}
        />
        <TextInput
          id="email_address"
          question="Mijn e-mailadres"
          placeholder="Optioneel"
          bind:answer={emailResponse.answer}
          bind:valid={emailResponse.valid}
          bind:validate={emailResponse.validate}
          bind:clear={emailResponse.clear}
        />
      </div>
    </div>
    <p class="mb-3"><small><span class="required">*</span> Verplicht veld</small></p>
    <CapWidget bind:token={capToken} {capjs_site_key} />
    <button type="submit" class="btn btn-primary" disabled={!capToken}>Verstuur</button>
  {/if}
</form>