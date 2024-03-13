<script lang="ts">
	import { DashSquareFill, PlusSquare, PlusSquareFill, Square } from 'svelte-bootstrap-icons';
	import Currency from '$lib/Currency.svelte';
  import type { BronData, BronDetail } from '../Types';
  import DataRow from '$lib/DataRow.svelte';
  export let row: BronData
  export let onClick: (event: MouseEvent, row: BronData) => Promise<any>
  export let level = 1
  export let hideZero: boolean = true
  export let lastRow: boolean = false
  export let bronnen: BronDetail[] = []
  export let rowNumber_level1 = 0
  export let rowNumber_level2 = 0
  export let rowNumber_level3 = 0
  export let metric: 'Bevolking' | 'Huishouden' | 'Oppervlakte' | undefined = undefined

  const _onClick = async  (event: MouseEvent, row: BronData) => {
    if (row?.$link && (row.Baten ?? 0) + (row.Lasten ?? 0) !== 0) {
      const tr = (event.currentTarget as HTMLElement);
      tr.classList.add('opening');
      return await onClick(event, row)
        .then(_ => tr.classList.remove('opening'))
    }
  }

  const getAmmountLevel2 = (bron: BronDetail, soort: 'Baten' | 'Lasten') => {
    const data = bron.data[rowNumber_level1].data
    if (data !== undefined) return data[rowNumber_level2][soort]
    return
  }

  const getAmmountLevel3 = (bron: BronDetail, soort: 'Baten' | 'Lasten') => {
    const data = bron.data[rowNumber_level1].data
    if (data !== undefined) {
      const data_l3 = data[rowNumber_level2].data
      if (data_l3 !== undefined) {
        try {
          return data_l3[rowNumber_level3][soort]
        } catch(e) {}
      }
    }
    return
  }

  const normalize = (ammount: number | null | undefined, bron: BronDetail) => {
    if (typeof ammount !== 'number') return ammount
    if (metric !== undefined && bron.metrics && bron.metrics[metric]) {
      return Math.round(100 * 1000 * ammount / bron.metrics[metric]) / 100 ;
    } else {
      return ammount
    }
  }

</script>
<style>
  span.closer {
		display: none;
	}
  span.spinner-border {
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

	:global(tr.opening span.closer, tr.opening span.opener) {
		 display: none !important;
	}

	:global(tr.opening .spinner-border) {
		 display: inline-block !important;
	}


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
  tr.level-2 .spinner-border {
    margin-left: 20px;
  }
  tr.level-2.lastRow .closer::before, tr.level-2.lastRow .opener::before {
    /* content: '┗'; */
    padding-right: 5px;
  }

  tr.level-3 .treenode::before {
    /* content: '┗'; */
    padding-left: 25px;
  }
  
	:global(th.code, td.code, th.togglerow, td.togglerow) {width: 1px ;}
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
  class:zero = {(row.Baten ?? 0) === 0 &&  (row.Lasten ?? 0) === 0}
  on:click={(ev) => _onClick(ev, row)} 
>
  <td class="togglerow">
    {#if ((row.Baten ?? 0) !== 0 || (row.Lasten ?? 0) !== 0) && level < 3}
    <span class="opener"><PlusSquareFill style="cursor: pointer;" fill="#888"/></span>
    <span class="closer"><DashSquareFill style="cursor: pointer;" fill="Black"/></span>
    <span class="spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>
    {:else}
    <span class="treenode"></span>
    {/if}
  </td>
  <td class="code" class:text-secondary = {(row.Baten ?? 0) === 0 && (row.Lasten ?? 0) === 0}>{row.Code}</td>
  <td class:text-secondary = {(row.Baten ?? 0) === 0 && (row.Lasten ?? 0) === 0}>{row?.Description ?? row?.Title}</td>
  {#if level === 1}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-success" ammount={normalize(bron.data[rowNumber_level1].Baten, bron)} symbol="" />
  </td>
  {/each}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-danger" ammount={normalize(bron.data[rowNumber_level1].Lasten, bron)} symbol="" /></td>
  {/each}
  {:else if level === 2}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-success" ammount={normalize(getAmmountLevel2(bron, 'Baten'), bron)} symbol="" /></td>
  {/each}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-danger" ammount={normalize(getAmmountLevel2(bron, 'Lasten'), bron)} symbol="" /></td>
  {/each}
  {:else if level === 3}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-success" ammount={normalize(getAmmountLevel3(bron, 'Baten'), bron)} symbol="" /></td>
  {/each}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-danger" ammount={normalize(getAmmountLevel3(bron, 'Lasten'), bron)} symbol="" /></td>
  {/each}
  {/if}
</tr>
{#if row?.data}
  {#each row.data as subrow, i}
    <DataRow 
      row={subrow} 
      onClick={onClick} 
      metric={metric} 
      level={level+1} 
      hideZero={hideZero} 
      rowNumber_level1={rowNumber_level1}
      rowNumber_level2={level === 1 ? i : rowNumber_level2}
      rowNumber_level3={level === 2 ? i : 0}
      bronnen={bronnen}
      lastRow={i+1 === row.data.filter(d => !hideZero || (d.Baten??0) + (d.Lasten??0) !== 0).length}/>
  {/each}
{/if}