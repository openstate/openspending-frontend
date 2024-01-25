<script lang="ts">
	import { onMount } from 'svelte';
	import type { SourceWithDatasets } from '../../../../Types.js';
	import { api } from '../../../../stores.js';

	export let data;
  let error: Error | undefined
  let Entity = data.Entity.replace('Regelingen', ' Regelingen')
  let Title = data.Slug
  let source: SourceWithDatasets

  const width = (PL1: string | null) => {
    return `${Math.round(1000 * ((PL1?parseInt(PL1):0) / total))/10}%`
  }

  const filters = {
    Period: (new Date()).getFullYear(),
    Dataset: ''
  }

  let Data: undefined | Array<{
    Title: string,
    documents: number,
    PL1: string | null,
    PL2: string | null
  }>
  let total = 0

  const periodRange: number[] = [filters.Period]

  const loadDataset = (ev?: Event) => {
    if (ev !== undefined) {
      const sel = ev.target as HTMLSelectElement
      const option = sel[sel.selectedIndex]
      filters.Period = parseInt(option.dataset.period ?? '')
      filters.Dataset = option.dataset.dataset ?? ''
    }
    Data = undefined
    fetch(`${$api}/documents/${filters.Dataset}/${source.Key}/hoofdfunctie`) 
      .then(response => {
        if (!response.ok) throw new Error(`Kan de bron '${filters.Dataset}/${source.Key}/hoofdfunctie' niet laden: ${response.statusText}`)
        return response.json()
      }).then(rows => {
        Data = rows
        total = 0
        Data?.forEach(row => {
          row.PL1!==null?parseInt(row.PL1):0
          total = total + (row.PL1!==null?parseInt(row.PL1):0)
          row.Title = row.Title.replace(/\d+\s+?/, '')
        })
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChart);
      })
      .catch(e => {
        error = e
      })
  }

  function drawChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Functie');
    dataTable.addColumn('number', 'Bedrag');
    dataTable.addColumn({type: 'string', role: 'tooltip'});
    dataTable.addColumn({type: 'string', role: 'annotation'});
    Data?.forEach(row => {
      const ammount = 1000 * (row.PL1!==null?parseInt(row.PL1):0)
      const title = row.Title
      dataTable.addRow([
        title,
        ammount,
        `${title} (€ ${ammount.toLocaleString()} / ${width(row.PL1)})`,
        `€ ${ammount.toLocaleString()}  (${width(row.PL1)})`,
      ])
    })
    
    var chart = new google.visualization.PieChart(document.getElementById('chart')!);
    google.visualization.events.addListener(chart, 'onmouseover', (cell:{row: number}) => {
      document.querySelector(`[data-row='${cell.row}'] div.progress-bar`)?.classList.toggle('bg-info')
    });
    google.visualization.events.addListener(chart, 'onmouseout', (cell:{row: number}) => {
      document.querySelector(`[data-row='${cell.row}'] div.progress-bar`)?.classList.toggle('bg-info')
    });
    chart.draw(dataTable, {
      is3D: false,
      legend: {
        position: 'none',
      },
      chartArea: {
        left:0,top:0,width:'100%',height:'100%'
      },
    });
    var barchart = new google.visualization.BarChart(document.getElementById("barchart")!);
    barchart.draw(dataTable, {
      legend: {
        position: 'none'
      },
      hAxis: {
        format: 'short',//'€ #,###',
        textStyle: {
          fontName: 'var(--bs-body-font-family)'
        }
      },
      vAxis: {
        textStyle: {
          fontName: 'var(--bs-body-font-family)',
          fontSize: 12
        }
      },
      chartArea: {
        top:0,
        width:'50%',
      },
    })
  }
    
  onMount(() => {
    fetch(`${$api}/sources/${data.Entity}/${data.Slug}`)
      .then(response => {
        if (!response.ok) throw new Error(`Kan de bron ${data.Entity}/${data.Slug} niet laden: ${response.statusText}`)
        return response.json()
      })
      .then(($source: SourceWithDatasets) => {
        Title = $source.Title
        source = $source
        periodRange.length = 0
        for (let y = $source.PeriodRange.max; y >= $source.PeriodRange.min; y--) periodRange.push(y)
        filters.Period = periodRange[0]
        filters.Dataset = $source.$datasets[0].Identifier
        loadDataset()
      }).catch(e => {
        error = e
      })

  })
</script>

<svelte:head>
	<title>{Title} | Open Spending</title>
	<meta property="og:title" content="{Title} | Open Spending" />
</svelte:head>
<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item"><a href="/gegevens">Gegevens</a></li>
		<li class="breadcrumb-item"><a href={`/gegevens/${data.Entity}`}>{Entity}</a></li>
		<li class="breadcrumb-item active" aria-current="page">{Title}</li>
	</ol>
</nav>
<h1>{Title}</h1>
{#if error !== undefined}
  <div class="alert alert-warning" role="alert">
    {error.message}
  </div>
{/if}
<div class="container">
  <div class="row align-items-start">
    <div class="col-12">
      <form class="mb-3">
        <select class="form-select"
        on:change={loadDataset}
        >
        {#if source !== undefined}
          {#each source.$datasets as dataset}
            <option data-period={dataset.Period} data-dataset={dataset.Identifier}>{dataset.Period}</option>    
          {/each}
        {/if}
        </select>
      </form>
    </div>
    {#if Data !== undefined}
      {#if total === 0}
        <div class="alert alert-warning" role="alert">
          Er zijn gegevens bekend over de periode {filters.Period}.
        </div>
      {:else}
        {#each Data as row, r}
          <!-- <h3 class="fs-6">{row.Title}</h3> -->
          <!-- <div class="progress mb-3" data-row={r} role="progressbar" aria-label="{row.Title.replace(/\d+\s+?/, '')}" >
            <div class="progress-bar" style="width: {width(row.PL1)}">{row.Title} € {(row.PL1?parseInt(row.PL1):0).toLocaleString()} ({width(row.PL1)})</div>
          </div> -->
        {/each}
          <!-- <h3 class="fs-6">Totaal</h3> -->
          <!-- <div class="progress mb-3" role="progressbar" aria-label="Totaal" >
            <div class="progress-bar" style="width: 100%">Totaal € {total.toLocaleString()}</div>
          </div> -->
          <div class="col-8">
            <div id="barchart" style="height: 500px;"></div>
          </div>
          <div class="col-4">
            <div id="chart" style="height: 400px;"></div>
          </div>
      {/if}
    {/if}
  </div>
</div>
