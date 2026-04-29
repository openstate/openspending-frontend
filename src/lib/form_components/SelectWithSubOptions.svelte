<script lang="ts">
  import Select from 'svelte-select';

  let validated = false

  export let question: string
  export let questionRequired: boolean = false
  export let items
  export let subItemsTitle = ''
  // subItems: if a selected item is contained in subItems, display a sub Select
  export let subItems: { [id: string] : string[] } = {}
  // subText: if a selected item is contained in subText, display a sub Text input
  export let subTextinputs: { [id: string] : string } = {}
  export let selected: string | undefined
  export let valid: boolean = true
  export let validate = () => {
    validated = true
    setValidClass()
  }
  export let clear = () => {
    selectedItem = undefined
    selectedSubItem = undefined
  }

  let selectedItem: { [id: string] : string } | undefined
  let selectedSubItem: { [id: string] : string } | undefined
  let showTextinput: boolean
  let showSubTextinput: boolean
  let textValue: string | undefined
  let showSubSelect: boolean
  let subItemsForItem: string[] = []
  let textinputPlaceholder: string
  let marginLeftTextinput: string

  $: {
    // Must a text box be shown for selected option?
    showTextinput = (selectedItem?.label || '') in subTextinputs
    showSubTextinput = (selectedSubItem?.value || '') in subTextinputs
    // Must a select with sub-items be shown for selected option?
    showSubSelect = (selectedItem?.label || '') in subItems
    marginLeftTextinput = "ms-2"

    if (showSubSelect) {
      subItemsForItem = subItems[selectedItem?.label || '']
    } else {
      subItemsForItem = []
      selectedSubItem = undefined
    }

    if (showTextinput) {
      textinputPlaceholder = subTextinputs[selectedItem?.value || '']
    } else if (showSubTextinput) {
      textinputPlaceholder = subTextinputs[selectedSubItem?.value || '']
    } else {
      textValue = undefined
      textinputPlaceholder = ''
    }

    if (showSubTextinput) {
      selected = selectedItem?.value + " - " + selectedSubItem?.value + " (" + textValue + ")"
      valid = !!textValue?.trim()
      marginLeftTextinput = "ms-3"
    } else if (showTextinput) {
      selected = selectedItem?.value + " (" + textValue + ")"
      valid = !!textValue?.trim()
    } else if (showSubSelect) {
      selected = selectedItem?.value + " - " + selectedSubItem?.value
      valid = !!selectedSubItem
    } else {
      selected = selectedItem?.value
      valid = !!selectedItem
    }
    setValidClass()
  }

  let validClass: string
  function setValidClass() {
    validClass = !validated || valid ? '' : 'alert alert-danger'
  }
</script>

<div class="form-component {validClass}">

  <p class="fw-bold">
    {question}
    {#if questionRequired}
    <span>*</span>
    {/if}
  </p>
  <Select {items} placeholder="Selecteer..." containerStyles="border-color: #888888;" bind:value={selectedItem} />
  {#if showSubSelect}
  <div class="mt-2 ms-2">
    <p class="fw-bold">{subItemsTitle}</p>
    <Select items={subItemsForItem} placeholder="Selecteer..." containerStyles="border-color: #888888;" bind:value={selectedSubItem} />
  </div>
  {/if}
  {#if showTextinput || showSubTextinput}
  <div class="mt-2 {marginLeftTextinput}">
    <input
      bind:value={textValue}
      class="form-control input-border-color mt-2"
      placeholder={textinputPlaceholder}
    />
  </div>
  {/if}
</div>