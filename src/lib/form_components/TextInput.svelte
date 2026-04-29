<script lang="ts">
  export let id
  export let question: string
  export let questionRequired: boolean = false
  export let answer: string | undefined
  export let placeholder
  export let css = ''

  let validated = false
  export let valid: boolean = true
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
<div class="{validClass} {css}">
  <label for="{id}" class="fw-bold">{question}</label>
  <input
    bind:value={answer}
    id={id}
    class="form-control input-border-color mt-2"
    placeholder={placeholder}
  />
</div>
