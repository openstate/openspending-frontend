<script lang="ts">
  export let ammount: number | null | undefined 
  export let symbol: string = '€'
  export let classes: string = ''
  export let multiplier: number = 1
  $: currency = ammount === null || ammount === undefined ? '-' : (symbol + (symbol?'&nbsp;':'') + (ammount * multiplier).toLocaleString('nl-NL'))
</script>
<span class="currency {classes}">{@html currency}</span>
