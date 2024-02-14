<script lang="ts">
	import type { BronDetail } from '../Types';
  export let hideZero = true
  export let baten = true
  export let titleLabel = 'Title'
	const ammount = (eur: number) => eur === 0 || !eur ? '-' : ('€ ' + eur.toLocaleString())
	const percentage = (eur: number, bron: BronDetail, BL: 'Baten' | 'Lasten') => eur === 0 || !eur ? '-' : (Math.round(10000 * eur / bron.totaal[BL].PL2)/100) + '%'

  export let bron: BronDetail
  $: BL = baten?'Baten':'Lasten' as 'Baten' | 'Lasten'
</script>
{#if bron !== undefined}
<table class="table table-striped table-sm caption-top">
  <caption class="fs-4 text-success fw-bold text-center"
  class:bg-success-subtle={baten}
  class:text-success={baten}
  class:bg-danger-subtle={!baten}
  class:text-danger={!baten}
  >
    {BL}  <em class="fs-6">(x €{parseInt(`1000`).toLocaleString()})</em>
  </caption>
  <thead>
  <tr>
    <tr>
      <th scope="col">{titleLabel}</th>
      <th scope="col" class="text-end">Bedrag</th>
      <th scope="col" class="text-end">%</th>
    </tr>
  </thead>
  <tbody class="table-group-divider">
    {#each bron[BL].filter(row => row.PL2 || !hideZero) as row} 
    <tr>
      <td width="70%">{row.Title}</td>
      <td width="20%" class="text-end" class:text-success={baten} class:text-danger={!baten}>{ammount(row.PL2)}</td>
      <td width="10%" class="text-end" class:text-success={baten} class:text-danger={!baten}>{percentage(row.PL2, bron, BL)}</td>
    </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr class="fw-bold" class:table-success={baten} class:table-danger={!baten} >
      <td width="70%" class="text-end">Totaal {BL}</td>
      <td width="20%" class="text-end">{ammount(bron.totaal[BL].PL2)}</td>
      <td width="10%" class="text-end">100%</td>
    </tr>
  </tfoot>
</table>
{/if}