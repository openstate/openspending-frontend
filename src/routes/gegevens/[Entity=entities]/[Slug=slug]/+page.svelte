<!-- <script lang="ts">
  //@ts-ignore
  import pkg from 'human-readable-numbers';
  import { periode, verslagsoort, groepering, baten_of_lasten} from './stores.js'
  const { toHumanString } = pkg;
	import { onMount } from 'svelte';
	import type { SourceWithDatasets } from '../../../../Types.js';
	import { api } from '../../../../stores.js';

	export let data;
  let error: Error | undefined
  let url = ''
  let source: SourceWithDatasets

  // $: $periode, loadData();
  // $: $verslagsoort, loadData();
  // $: $groepering, loadData();
  // $: $baten_of_lasten, loadData();

  const width = (PL2: number | null, total: number) => {
    return `${Math.round(1000 * ((PL2?PL2:0) / total))/10}%`
  }

  let Details: BronDetailBaten | BronDetailLasten

  const loadData = async () => {
    url = `${$api}/bronnen/${data.Entity}/${data.Slug}/${$periode}/${$verslagsoort}/${$baten_of_lasten}/per/${$groepering}`
    Details = await fetch(url) 
      .then(response => {
        if (!response.ok) throw new Error(`Kan de bron '${url}' niet laden: ${response.statusText}`)
        return response.json()
      })
      .catch(e => {
        error = e
      })
      google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
  }

  function drawChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Functie');
    dataTable.addColumn('number', 'Bedrag');
    dataTable.addColumn({type: 'string', role: 'tooltip'});
    dataTable.addColumn({type: 'string', role: 'annotation'});
    (Details.baten ?? Details.lasten).forEach(row => {
      const ammount = 1000 * (row.PL2!==null?row.PL2:0)
      dataTable.addRow([
        row.Categorie,
        ammount,
        `${row.Categorie} (€ ${toHumanString(ammount)} / ${width(row.PL2, Details.totaal.PL2)})`,
        `€ ${toHumanString(ammount)}  (${width(row.PL2, Details.totaal.PL2)})`,
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
</script>

<svelte:head>
	<title>{data.Bron.Title} | Open Spending</title>
	<meta property="og:title" content="{data.Bron.Title} | Open Spending" />
</svelte:head>
<nav aria-label="breadcrumb">
	<ol class="breadcrumb">
		<li class="breadcrumb-item"><a href="/">Home</a></li>
		<li class="breadcrumb-item"><a href="/gegevens">Gegevens</a></li>
		<li class="breadcrumb-item"><a href={`/gegevens/${data.Entity}`}>{data.Entity.replace('Regelingen', ' Regelingen')}</a></li>
		<li class="breadcrumb-item active" aria-current="page">{data.Bron.Title}</li>
	</ol>
</nav>
<h1>{data.Bron.Title}</h1>
<code>{url}</code>
<pre>{JSON.stringify(data.Bron, null, 2)}</pre>
{#if error !== undefined}
  <div class="alert alert-warning" role="alert">
    {error.message}
  </div>
{/if}
<div class="container">
</div> -->
