<script lang="ts">
	import { DashSquareFill, GraphUp, PlusSquareFill, Square } from 'svelte-bootstrap-icons';
	import Currency from '$lib/Currency.svelte';
  import type { BronData, BronDetail } from '../Types';
  import DataRow from '$lib/DataRow.svelte';
  export let row: BronData
  export let onClick: (event: MouseEvent, row: BronData) => Promise<any>
  export let trendsPerHoofdfunctie: ((event: MouseEvent, row: BronData) => Promise<any>) | undefined = undefined
  export let level = 1
  export let hideZero: boolean = true
  export let lastRow: boolean = false
  export let bronnen: BronDetail[] = []
  export let rowNumber_level1 = 0
  export let rowNumber_level2 = 0
  export let rowNumber_level3 = 0
  export let metric: 'Bevolking' | 'Huishouden' | 'Oppervlakte' | undefined = undefined

  // If multiple municipalities are shown and the first municipality has no entries for certain categories
  // these categories would be missing. Therefore first aggregate all categories
  $: batenZero = (row.Baten ?? 0) == 0
  $: lastenZero = (row.Lasten ?? 0) == 0
  $: allDataRows = row?.data || []
  $: allDataRowIds = allDataRows.map((d) => d.ID)
  $: {
    for (let bron of bronnen) {
      let data = getDataForLevel(bron)
      if ((data?.Baten ?? 0) > 0) batenZero = false
      if ((data?.Lasten ?? 0) > 0) lastenZero = false
      for (const d of (data?.data || [])) {
        if (!allDataRowIds.includes(d.ID)) {
          allDataRowIds.push(d.ID)
          allDataRows.push({ID: d.ID, Title: d.Title, Code: d.Code, Description: d.Description})
        }
      }
    }
  }

  const _onClick = async  (event: MouseEvent, row: BronData) => {
    if((event.target as HTMLElement).classList.contains('trendsPerHoofdfunctie')) {
      return
    }
    if (row?.$link && (!batenZero || !lastenZero)) {
      const tr = (event.currentTarget as HTMLElement);
      tr.classList.add('opening');
      return await onClick(event, row)
        .then(_ => tr.classList.remove('opening'))
    }
  }

  const getDataForLevel = (bron: BronDetail) => {
    if (level === 1) {
      return (bron.data[rowNumber_level1])
    } else if (level === 2) {
      const data = bron.data[rowNumber_level1].data
      return (data?.[rowNumber_level2])
    } else if (level === 3) {
      const data = bron.data[rowNumber_level1].data
      const data_l2 = data?.[rowNumber_level2]?.data
      return data_l2?.[rowNumber_level3]
    }
    return
  }

  const normalize = (amount: number | null | undefined, bron: BronDetail) => {
    if (typeof amount !== 'number') return amount
    if (metric !== undefined && bron.metrics && bron.metrics[metric]) {
      return Math.round(100 * 1000 * amount / bron.metrics[metric]) / 100 ;
    } else {
      return amount
    }
  }

  const getAmount = (bron: BronDetail, soort: 'Baten' | 'Lasten') => {
    const data = getDataForLevel(bron)
    return normalize(data?.[soort], bron)
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
  data-id={row.ID}
  data-link={row.$link} 
  data-loaded=""
  class:opened = {(row.data??[]).length > 0}
  class:hide-zero = {hideZero}
  class:level-1={level ===1}
  class:level-2={level ===2}
  class:level-3={level ===3}
  class:lastRow={lastRow}
  class:zero = {batenZero && lastenZero}
  on:click={(ev) => _onClick(ev, row)} 
>
  <td class="togglerow">
    {#if (!batenZero || !lastenZero) && level < 3}
    <span class="opener"><PlusSquareFill style="cursor: pointer;" fill="#888"/></span>
    <span class="closer"><DashSquareFill style="cursor: pointer;" fill="Black"/></span>
    <span class="spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>
    {:else}
    <span class="treenode"></span>
    {/if}
  </td>
  <td class="code" class:text-secondary = {batenZero && lastenZero}>{row.Code}</td>
  <td class:text-secondary = {batenZero && lastenZero}>
    {#if trendsPerHoofdfunctie}
    <div class="row">
      <div class="col-11">
        {row?.Description ?? row?.Title}
      </div>
      <div class="col-1 text-end">
        <a href="{'#'}" on:click|preventDefault={(ev) => trendsPerHoofdfunctie(ev, row)}><GraphUp  class="trendsPerHoofdfunctie"/></a>
      </div>
    </div>
    {:else}
     {row?.Description ?? row?.Title}
    {/if}
  </td>
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-primary" ammount={getAmount(bron, 'Baten')} symbol="" />
  </td>
  {/each}
  {#each bronnen as bron}
  <td class="text-end"><Currency classes="text-info" ammount={getAmount(bron, 'Lasten')} symbol="" /></td>
  {/each}
</tr>
{#each allDataRows as subrow, i}
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
    trendsPerHoofdfunctie={trendsPerHoofdfunctie}
    lastRow={i+1 === row?.data?.filter(d => !hideZero || (d.Baten??0) + (d.Lasten??0) !== 0).length}/>
{/each}