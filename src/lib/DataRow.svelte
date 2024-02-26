<script lang="ts">
	import { DashSquareFill, PlusSquare, PlusSquareFill, Square } from 'svelte-bootstrap-icons';
	import Currency from '$lib/Currency.svelte';
  import type { BronData, BronDetail } from '../Types';
  import DataRow from '$lib/DataRow.svelte';
	import Bak from '../routes/gegevens/[Entity=entities]/[Slug=slug]/[...filters]/BAK.svelte';
  export let row: BronData | undefined = undefined
  export let onClick
  export let level = 1
  export let hideZero: boolean = true
  export let lastRow: boolean = false
  export let bronnen: BronDetail[] = []
  export let rowNumber_level1 = 0
  export let rowNumber_level2 = 0
  export let rowNumber_level3 = 0
</script>
<style>
  	span.closer {
		display: none;
	}
	.opened span.opener {
		 display: none;
	}
	.opened span.closer {
		 display: inherit;
	}
	.hide-zero.zero {
		display: none;
	}
	.opened>td {font-weight: bold;}

	/* :global(.opened>td>.currency) {display: none;} */

  tr.level-1, tr.level-2 {
    cursor: pointer;
  }

  tr.level-2 td.togglerow {
    padding-left: 10px;
  }

  tr.level-2 .closer, tr.level-2 .opener {
    padding-left: 20px;
  }
  tr.level-2.lastRow .closer::before, tr.level-2.lastRow .opener::before {
    /* content: '┗'; */
    padding-right: 5px;
  }

  tr.level-3 .treenode::before {
    /* content: '┗'; */
    padding-left: 25px;
  }
  
  tr.level-2 td.togglerow span.treenode {
    /* content: '┗'; */
    /* padding-right: 50px; */
  }

	th.code, td.code, th.togglerow, td.togglerow {width: 1px ;}
</style>
<tr 
  id={row.Code}
  data-link={row.$link} 
  data-loaded=""
  class:opened = {row.data?.length??0 > 0}
  class:hide-zero = {hideZero}
  class:level-1={level ===1}
  class:level-2={level ===2}
  class:level-3={level ===3}
  class:lastRow={lastRow}
  class:zero = {(row.Baten ?? 0) + (row.Lasten ?? 0) === 0}
  on:click={() => { if (row?.$link && (row.Baten ?? 0) + (row.Lasten ?? 0) !== 0) onClick(row)}} 
>
  <td class="togglerow">
    {#if (row.Baten ?? 0) + (row.Lasten ?? 0) !== 0 && level < 3}
    <span class="opener"><PlusSquareFill style="cursor: pointer;" fill="#888"/></span>
    <span class="closer"><DashSquareFill style="cursor: pointer;" fill="Black"/></span>
    {:else}
    <span class="treenode"></span>
    {/if}
  </td>
  <td class="code" class:text-secondary = {(row.Baten ?? 0) + (row.Lasten ?? 0) === 0}>{row.Code}</td>
  <td class:text-secondary = {(row.Baten ?? 0) + (row.Lasten ?? 0) === 0}>{row?.Description ?? row?.Title}</td>
  {#if level === 1}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-success" ammount={bron.data[rowNumber_level1].Baten} /></td>
  {/each}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-danger" ammount={bron.data[rowNumber_level1].Lasten} /></td>
  {/each}
  {:else if level === 2}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-success" ammount={bron.data[rowNumber_level1].data[rowNumber_level2].Baten} /></td>
  {/each}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-danger" ammount={bron.data[rowNumber_level1].data[rowNumber_level2].Lasten} /></td>
  {/each}
  {:else if level === 3}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-success" ammount={bron.data[rowNumber_level1].data[rowNumber_level2].data[rowNumber_level3]?.Baten} /></td>
  {/each}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-danger" ammount={bron.data[rowNumber_level1].data[rowNumber_level2].data[rowNumber_level3]?.Lasten} /></td>
  {/each}
  {/if}
</tr>
{#if row?.data}
  {#each row.data as subrow, i}
    <DataRow 
      row={subrow} 
      onClick={onClick} 
      level={level+1} 
      hideZero={hideZero} 
      rowNumber_level1={rowNumber_level1}
      rowNumber_level2={level === 1 ? i : rowNumber_level2}
      rowNumber_level3={level === 2 ? i : 0}
      bronnen={bronnen}
      lastRow={i+1 === row.data.filter(d => !hideZero || (d.Baten??0) + (d.Lasten??0) !== 0).length}/>
  {/each}
{/if}