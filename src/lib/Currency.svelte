<script lang="ts">
  export let ammount: number | null | undefined
  export let symbol: string = '€'
  export let classes: string = ''
  export let multiplier: number = 1
  $: currency = (ammount === 0 || !ammount) ? '-' : (symbol + ' ' + (ammount * multiplier).toLocaleString('nl-NL'))
</script>
<span class="currency {classes}">{currency}{#if multiplier===1 && currency !== '-'}<small>k</small>{/if}</span>
