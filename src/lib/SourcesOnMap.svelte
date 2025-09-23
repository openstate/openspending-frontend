<script lang="ts">
	import { onMount } from 'svelte';
	import type { Adres, Bron, SourceType } from '../Types';
  import { page } from '$app/stores';
  $: session = $page.data.session
	import { ucfirst } from './utils';


  export let Entity: SourceType
  import 'leaflet/dist/leaflet.css';
  import { get } from 'svelte/store'
  import { api } from '../stores.js'
	import { goto } from '$app/navigation';
	import { CartCheck } from 'svelte-bootstrap-icons';
	import type { TileLayer, WMSOptions } from 'leaflet';
	import { apiGet } from '../utils';

  let sources: Bron[] = []
  let filteredSources: Bron[] = []
  let error: Error | undefined
  let findSourceField: HTMLInputElement
  let onlyDetailData: boolean = false

  const defaultStyle: L.PathOptions = {
    fillColor: 'rgb(97, 168, 169)',
    color: 'rgb(97, 168, 169)',
    fillOpacity: 0.2
  }
  const hoverStyle: L.PathOptions = {
    fillColor: 'rgb(200, 46, 148)',
    fillOpacity: 0.8
  }

  const hasDetaildataFillColor = 'rgb(108, 202, 209)'
  const hasDetailStyle: L.PathOptions = {
    fillColor: hasDetaildataFillColor,
    fillOpacity: 0.8
  }

  const toggleOnlyDetaildata = () => {
    if (Entity === 'Gemeenten' && onlyDetailData === true) {
      filteredSources = filteredSources.filter(row => row.hasDetaildata)
    } else {
      filteredSources = sources
    }
  }

  const setEntity = (event: Event) => {
    Entity = ((event.target as HTMLAnchorElement).dataset.entity ?? 'Gemeenten') as SourceType;
    LayerGemeenten.removeFrom(map)
    LayerWaterschappen.removeFrom(map)
    LayerProvincies.removeFrom(map)
    LayerGemeenschappelijkeRegelingen.removeFrom(map)
    switch (Entity) {
      case 'Provincies':
        LayerProvincies.addTo(map)
        ActiveLayer = LayerProvincies
        break;
      case 'Gemeenten':
        LayerGemeenten.addTo(map)
        ActiveLayer = LayerGemeenten
        break;
      case 'Waterschappen':
        LayerWaterschappen.addTo(map)
        ActiveLayer = LayerWaterschappen
        break;
      case 'GemeenschappelijkeRegelingen':
        LayerGemeenschappelijkeRegelingen.addTo(map)
        ActiveLayer = LayerGemeenschappelijkeRegelingen
        break;
    }
    load()
    goto(`/gegevens/${Entity}`)
  }
  const load = () => {
    if (clickmarker) clickmarker.removeFrom(map)

    apiGet(`/bronnen/${Entity}`, session.Token)
      .then(response => {
        if (!response.ok) throw new Error(`Kan de bronnen niet laden: ${get(api)}/bronnen/${Entity} ${response.statusText}`)
        return response.json()
      })
      .then($sources => {
        sources = $sources
        filteredSources = [...sources]
        toggleOnlyDetaildata()
        findSourceField.value = ''
      }).catch(e => {
        error = e
      })
	};

  const highlight = (entity: SourceType, key: string, highlight: boolean = true) => {
    if (entity !== 'GemeenschappelijkeRegelingen') {
      // @ts-ignore
      const layer = ActiveLayer.getLayers().filter(l => l.feature.id === key || l.feature.properties.code === key).shift()
      try {
      // @ts-ignore
        layer.setStyle(highlight ? hoverStyle : layer.options.hasDetailData ? hasDetailStyle : defaultStyle)
      } catch(e) {}
    }
  }

  const highlightGemeentesWithDetailData = () => {
    // event is triggered before change:
    const checked = !onlyDetailData
    const keys = sources.filter(s => s.hasDetaildata).map(s => s.Key)
    // @ts-ignore
    const layers = LayerGemeenten.getLayers().filter(l => keys.includes(l.feature.id))
    // @ts-ignore
    layers.map(l => l.setStyle(checked ? hasDetailStyle: defaultStyle))
    // @ts-ignore
    layers.map(l => l.options.hasDetailData = checked)
  }
  let map: L.Map
  let LayerGemeenten: L.GeoJSON
  let LayerProvincies:L.GeoJSON
  let LayerWaterschappen:L.GeoJSON
  let LayerGemeenschappelijkeRegelingen:L.LayerGroup
  let ActiveLayer:L.GeoJSON | L.LayerGroup
  let clickmarker: L.Marker

  onMount(async () => {
    const L = await import('leaflet')
    map = L.map('map').setView([52.242111, 5.633167], 8);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
      // .addTo(map);
    
     L.tileLayer("https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png", {
        id: "brt",
        attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl/" target="_blank" rel="noopener">Kadaster</a>'
    }).addTo(map);

    // https://service.pdok.nl/hwh/waterschapsgrenzenimso/wms/v1_0?QUERY_LAYERS=waterschap&INFO_FORMAT=application%2Fjson&REQUEST=GetFeatureInfo&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&layers=waterschap&DPI=180&MAP_RESOLUTION=180&FEATURE_COUNT=8&I=50&J=50&WIDTH=101&HEIGHT=101&CRS=EPSG%3A28992&BBOX=142859.07278883766%2C374140.9144965779%2C288632.9530851135%2C519914.79479285376

    // const wmsOptions: WMSOptions = {
    //   layers: 'waterschap',
    //   version: '1.3.0',
    //   transparent: true,
    //   detectRetina: true,
    //   format: 'image/png',
    //   attribution: 'Waterschappen Administratieve eenheden (INSPIRE geharmoniseerd) WMS'
    // }
    // L.tileLayer.wms('https://service.pdok.nl/hwh/waterschapsgrenzenimso/wms/v1_0?', wmsOptions).addTo(map);

    type FeatureProperties = {
      statcode: string,
      statnaam: string,
      rubriek: 'gemeente' | 'provincie' | 'waterschappen'
    }


    const clickLayer = async (ev: L.LeafletMouseEvent, feature: GeoJSON.Feature<GeoJSON.Geometry, any>, layer: L.Layer) => {
      const props = feature.properties as FeatureProperties
      await fetch(`${get(api)}/bronnen/Key/${props.statcode}`)
        .then(async res => {
          if (res.ok) {
            const Brontype = feature.properties.rubriek === 'provincie' ? 'Provincies' : (feature.properties.rubriek === 'waterschappen' ? 'Waterschappen' : 'Gemeenten')
            const source = await res.json()
            if (clickmarker !== undefined) {
              clickmarker.removeFrom(map)
            }
            clickmarker = L.marker(ev.latlng)
            let content = ''
            if (Brontype === 'Waterschappen') {
              content = `
              <p class="fs-6">${source.Title}</p>
              <p>${ucfirst(source.verslagsoort)} ${source.dataset.Period}</p>
              <p><a href="/gegevens/${Brontype}/${source.Slug}">Ga naar gegevens &raquo;</a></p>
              `
            } else {
              content = `
              <p class="fs-6">${source.Title}</p>
              <p>${ucfirst(source.verslagsoort)} ${source.dataset.Period}:<br>
              Baten: € ${(1000 * source.totaal.Baten).toLocaleString()}<br>Lasten: € ${(source.totaal.Lasten * 1000).toLocaleString()}
              </p>
              <p><a href="/gegevens/${Brontype}/${source.Slug}">Ga naar gegevens &raquo;</a></p>
              `
            }
      			clickmarker.bindPopup(content);
            clickmarker.addTo(map)
            clickmarker.openPopup()
            clickmarker.getPopup()?.addEventListener('remove', () => {
             clickmarker.removeFrom(map)
            })
            // goto(`/gegevens/${Brontype}/${source.Slug}`)
          }
        })
    }


    const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, any>, layer: L.Layer) => {
      layer.bindTooltip(feature.properties.statnaam);
      layer.on({
        click: async (e) => await clickLayer(e, feature, layer),
        mouseover: (e) => {
          e.target.setStyle(hoverStyle);
        },
        mouseout: (e) => {
          e.target.setStyle(e.target.options.hasDetailData ? hasDetailStyle : defaultStyle);
        }
      })
    }

    fetch('/geojson/Gemeenten.geojson')
      .then(res => res.json())
      .then(gemeenten => {
        LayerGemeenten = L.geoJSON(gemeenten, {
          style: defaultStyle,
          onEachFeature
        })
        if (Entity === 'Gemeenten') {
          LayerGemeenten.addTo(map);
          ActiveLayer = LayerGemeenten
        }
      })
    
    fetch('/geojson/Provincies.geojson')
      .then(res => res.json())
      .then(provincies => {
        LayerProvincies = L.geoJSON(provincies, {
          style: defaultStyle,
          onEachFeature,
        })
        if (Entity === 'Provincies') {
          LayerProvincies.addTo(map);
          ActiveLayer = LayerProvincies
        }
      })
    fetch('/geojson/Waterschappen.geojson')
      .then(res => res.json())
      .then(waterschappen => {
        LayerWaterschappen = L.geoJSON(waterschappen, {
          style: defaultStyle,
          onEachFeature,
        })
        if (Entity === 'Waterschappen') {
          LayerWaterschappen.addTo(map);
          ActiveLayer = LayerWaterschappen
        }
      })

    const factor = 2/3
    const icon = L.icon({
        iconUrl: '/images/markers/marker-icon-2x.png',
        shadowUrl: '/images/markers/marker-shadow.png',
        iconSize:     [factor * 25, factor * 41], // size of the icon
        shadowSize:   [factor * 41, factor * 41], // size of the shadow
        shadowAnchor: [factor * 13, factor * 20],  // the same for the shadow
        popupAnchor:  [factor * 0, factor * 20] // point from which the popup should open relative to the iconAnchor
    });

    fetch(`${get(api)}/gemeenschappelijkeregeling/adres`)
      .then(res => res.json() as Promise<Array<Adres>>)
      .then(adressen => {
        LayerGemeenschappelijkeRegelingen = new L.LayerGroup([])
        for (const adres of adressen) {
          const werkgebieden = []
          for (const werkgebied of adres.werkgebieden) {
            werkgebieden.push(` • <a href="/gegevens/${werkgebied.Type}/${werkgebied.Slug}">${werkgebied.Title}</a>`)
          }
          const content = `<p class="fs-6"><a href="/gegevens/GemeenschappelijkeRegelingen/${adres.Slug}">${adres.Description}</a></p><p>${adres.adres.split('\n').join('<br>')}</p>`
            + (werkgebieden.length > 0 ? `<p>Werkgebied:<br>${werkgebieden.join('<br>')}</p>`  : '')
          
          L.marker([adres.lat, adres.lon], { icon })
            .bindPopup(content)
            .bindTooltip(adres.Description)
            .addTo(LayerGemeenschappelijkeRegelingen)
        }
        if (Entity === 'GemeenschappelijkeRegelingen') {
          LayerGemeenschappelijkeRegelingen.addTo(map);
          ActiveLayer = LayerGemeenschappelijkeRegelingen
        }
        
      })
    
    

    findSourceField = document.getElementById('find-source') as HTMLInputElement
    document.body.addEventListener('keydown', (ev) => {
      // @ts-ignore
      if (ev.target?.tagName.toUpperCase() == 'INPUT') return
      if(ev.key === '/') {
        ev.preventDefault()
        findSourceField.focus()
        findSourceField.select()
      }
    })
    findSourceField.addEventListener('keyup', (ev) => {
      const q = findSourceField.value
      if (q!=='') filteredSources = sources
        .filter(source => source.Title.toLowerCase().includes(q.toLowerCase()))
        .filter(source => {
          if (Entity === 'Gemeenten' && onlyDetailData === true) {
            return source.hasDetaildata
          } else {
            return true
          }
        })
      else filteredSources = [...sources]
    })
    load()
  })

</script>

<svelte:head>
	<title>Open Spending | {Entity}</title>
	<meta property="og:title" content="Open Spending | {Entity}" />
</svelte:head>
<style>
  a.nav-link {
    color: var(--primary-color);
  }
  a.nav-link.active {
    font-weight: normal;
  }
  ul li {
    padding-left: 0px;
  }
  #Sources ul li a {
    display: block;
    line-height: 2.5em;
  }
</style>

<div class="row mb-1">
  <div class="col-12">
    <ul class="nav nav-underline">
      <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'Gemeenten'} on:click={setEntity} data-entity="Gemeenten" href={'#'}>Gemeenten</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'Provincies'} on:click={setEntity} data-entity="Provincies" href={'#'}>Provincies</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'Waterschappen'} on:click={setEntity} data-entity="Waterschappen" href={'#'}>Waterschappen</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'GemeenschappelijkeRegelingen'} on:click={setEntity} data-entity="GemeenschappelijkeRegelingen" href={'#'}>Gemeenschappelijke regelingen</a>
      </li>
    </ul>
  </div>
</div>
<div class="row">
  <div class="col-sm-12 col-lg-8">
    <div class="container">
      <div id="map" style="width: 100%; height: 640px;"></div>
      {#if Entity === 'GemeenschappelijkeRegelingen' || Entity === 'Waterschappen'}
        <div class="position-relative bottom-0 end-0 alert alert-warning" role="alert" style="opacity: 0.7;">
          <strong>Let op: </strong>niet alle {Entity === 'GemeenschappelijkeRegelingen' ? 'gemeenschappelijke regelingen' : 'waterschappen'} staan op de kaart, zie de lijst voor een compleet overzicht.
        </div>
      {/if}
    </div>
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="input-group mt-2">
      <input id="find-source" aria-label="Zoek" class="form-control" type="text" size="20" placeholder="zoek {Entity === 'GemeenschappelijkeRegelingen' ? 'Gem. regelingen' : Entity} &hellip;">
      <span class="input-group-text"><kbd>/</kbd></span>
    </div>
    {#if Entity === 'Gemeenten' && sources.some(source => source.hasDetaildata)}
    <div class="input-group mt-2">
    <input class="form-check-input" type="checkbox" on:change={() => {load(); highlightGemeentesWithDetailData();}} id="onlyDetailData" bind:checked={onlyDetailData} />
    <label class="form-check-label" style="padding-left: 10px;" for="onlyDetailData">Alleen organisaties met <a href="/gegevens/detaildata">detaildata</a>.</label>
    
    </div>
    {/if}
    <div id="Sources">
      <ul class="list-unstyled mt-3" style="height: 640px; overflow: scroll;">
      {#each filteredSources as source}
        <li><a 
          on:mouseover={() => highlight(Entity, source.Key)} 
          on:mouseout={() => highlight(Entity, source.Key, false)} 
          on:focus={() => {}}
          on:blur={() => {}}
          href="/gegevens/{Entity}/{source.Slug}">{Entity === 'GemeenschappelijkeRegelingen' ? source.Description : source.Title.replace(' (PV)', '')}
          </a></li>
      {/each}
      </ul>
    </div>
  </div>
</div>
{#if error !== undefined}
  <div class="alert alert-warning" role="alert">
    {error.message}
  </div>
{/if}
