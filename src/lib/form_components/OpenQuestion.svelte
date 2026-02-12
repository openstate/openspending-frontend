<script lang="ts">
  let validated = false

  export let question: string
  export let questionRequired: boolean = false
  export let answer: string | undefined
  export let valid: boolean = true
  export let placeholder: string
  export let numberOfLines: number = 1
  export let validate = () => {
    validated = true
    setValidClass()
  }
  export let clear = () => {
    answer = undefined
  }

  $: valid = (!questionRequired || questionRequired && !!(answer || '').trim())

  let validClass: string
  function setValidClass() {
    validClass = !validated || valid ? '' : 'alert alert-danger'
  }
</script>

<div class="form-component {validClass}">
  <p>{question}</p>
  {#if numberOfLines == 1}
    <input
      name="openquestion"
      bind:value={answer}
      class="form-control"
      on:change={setValidClass}
      {placeholder}
    />
  {:else}
    <textarea
      name="openquestion"
      bind:value={answer}
      class="form-control"
      on:change={setValidClass}
      {placeholder}
      rows={numberOfLines}
    />
  {/if}
</div>