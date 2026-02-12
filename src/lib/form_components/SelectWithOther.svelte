<script lang="ts">
  import Select from 'svelte-select';

  let validated = false

  export let question: string
  export let questionRequired: boolean = false
  export let items
  export let selected: string | undefined
  export let valid: boolean = true
  export let otherOption:string
  export let other_placeholder: string
  export let validate = () => {
    validated = true
    setValidClass()
  }
  export let clear = () => {
    selectedItem = undefined
  }

  let selectedItem: { [id: string] : string } | undefined
  let other: string | undefined
  let other_class: string

  $: if (selectedItem && selectedItem.label == otherOption) {
    other_class = ''
    selected = other
    valid = !!other?.trim()
    setValidClass()
  } else {
    other_class = 'd-none'
    other = undefined
    selected = selectedItem && selectedItem.value
    valid = !!selectedItem
    setValidClass()
  }

  let validClass: string
  function setValidClass() {
    validClass = !validated || valid ? '' : 'alert alert-danger'
  }
</script>

<div class="form-component {validClass}">
  <p>
    {question}
    {#if questionRequired}
    <span>*</span>
    {/if}
  </p>
  <Select {items} placeholder="Selecteer..." bind:value={selectedItem} />
  <input
    bind:value={other}
    class="{other_class} form-control mt-2"
    placeholder={other_placeholder}
  />
</div>