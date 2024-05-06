<script lang="ts">
	import { onMount } from 'svelte';
	import type { Adres, Bron, SourceType } from '../Types';
  import { page } from '$app/stores';
	import { isLive } from './utils';


  export let Entity: SourceType
  import 'leaflet/dist/leaflet.css';
  import { api } from '../stores.js'
	import { goto } from '$app/navigation';

  let sources: Bron[] = []
  let filteredSources: Bron[] = []
  let error: Error | undefined
  let findSourceField: HTMLInputElement
  let onlyDetailData: boolean = false

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
    LayerProvincies.removeFrom(map)
    LayerGemeenschappelijkeRegelingen.removeFrom(map)
    switch (Entity) {
      case 'Provincies':
        LayerProvincies.addTo(map)
        break;
      case 'Gemeenten':
        LayerGemeenten.addTo(map)
        break;
      case 'GemeenschappelijkeRegelingen':
        LayerGemeenschappelijkeRegelingen.addTo(map)
        break;
    }
    load()
    goto(`/gegevens/${Entity}`)
  }
  const load = () => {
    fetch(`${$api}/bronnen/${Entity}`)
      .then(response => {
        if (!response.ok) throw new Error(`Kan de bronnen niet laden: ${$api}/bronnen/${Entity} ${response.statusText}`)
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
  let map: L.Map
  let LayerGemeenten: L.GeoJSON
  let LayerProvincies:L.GeoJSON
  let LayerGemeenschappelijkeRegelingen:L.LayerGroup

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

    type FeatureProperties = {
      statcode: string,
      statnaam: string,
      rubriek: 'gemeente' | 'provincie'
    }

    let clickmarker: L.Marker

    const clickLayer = async (ev: L.LeafletMouseEvent, feature: GeoJSON.Feature<GeoJSON.Geometry, any>, layer: L.Layer) => {
      const props = feature.properties as FeatureProperties
      await fetch(`${$api}/bronnen/Key/${props.statcode}`)
        .then(async res => {
          if (res.ok) {
            const Brontype = feature.properties.rubriek === 'gemeente' ? 'Gemeenten' : 'Provincies'
            const source = await res.json()
            if (clickmarker !== undefined) {
              clickmarker.removeFrom(map)
            }
            clickmarker = L.marker(ev.latlng)
            let content = `
				    <p class="fs-6">${source.Title}</p>
				    <p><a href="/gegevens/${Brontype}/${source.Slug}">Ga naar gegevens &raquo;</a></p>
				    `
            const a = 1

            content += `<p>Laatste gegevens (${source.dataset.Period}):<br>Baten: € ${(1000 * source.totals.Baten).toLocaleString()}<br>Lasten: € ${(source.totals.Lasten * 1000).toLocaleString()}</p>`
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

    const defaultStyle: L.PathOptions = {
      fillColor: 'rgb(97, 168, 169)',
      color: 'rgb(97, 168, 169)',
      fillOpacity: 0.2
    }
    const hoverStyle: L.PathOptions = {
      fillColor: 'rgb(200, 46, 148)',
      fillOpacity: 0.8
    }

    const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, any>, layer: L.Layer) => {
      layer.bindTooltip(feature.properties.statnaam);
      layer.on({
        click: async (e) => await clickLayer(e, feature, layer),
        mouseover: (e) => {
          e.target.setStyle(hoverStyle);
        },
        mouseout: (e) => {
          e.target.setStyle(defaultStyle);
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
        if (Entity === 'Gemeenten') LayerGemeenten.addTo(map);
      })
    
    fetch('/geojson/Provincies.geojson')
      .then(res => res.json())
      .then(provincies => {
        LayerProvincies = L.geoJSON(provincies, {
          style: defaultStyle,
          onEachFeature,
        })
        if (Entity === 'Provincies') LayerProvincies.addTo(map);
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

    fetch(`${$api}/gemeenschappelijkeregeling/adres`)
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
        if (Entity === 'GemeenschappelijkeRegelingen') LayerGemeenschappelijkeRegelingen.addTo(map);
        
      })
    
    

    findSourceField = document.getElementById('find-source') as HTMLInputElement
    document.body.addEventListener('keydown', (ev) => {
      // @ts-ignore
      if (ev.target?.tagName.toUpperCase() == 'INPUT') return
      ev.preventDefault()
      if(ev.key === '/') {
        findSourceField.focus()
        findSourceField.select()
      }
    })
    findSourceField.addEventListener('keyup', (ev) => {
      const q = findSourceField.value
      if (q!=='') filteredSources = sources.filter(source => source.Title.toLowerCase().includes(q.toLowerCase()))
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
  ul li {
    padding-left: 0px;
  }
  ul li a {
    display: block;
    line-height: 2.5em;
  }
</style>

<div class="row">
  <div class="col-12">
    <ul class="nav nav-underline">
      <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'Gemeenten'} on:click={setEntity} data-entity="Gemeenten" href={'#'}>Gemeenten</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'Provincies'} on:click={setEntity} data-entity="Provincies" href={'#'}>Provincies</a>
      </li>
      <!-- <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'Waterschappen'} on:click={setEntity} data-entity="Waterschappen" href={'#'}>Waterschappen</a>
      </li> -->
      <li class="nav-item">
        <a class="nav-link" class:active={Entity === 'GemeenschappelijkeRegelingen'} on:click={setEntity} data-entity="GemeenschappelijkeRegelingen" href={'#'}>Gemeenschappelijke regelingen</a>
      </li>
    </ul>
  </div>
</div>
<div class="row">
  <div class="col-sm-12 col-lg-8">
    <div id="map" style="width: 100%; height: 640px;"></div>
    {#if Entity === 'GemeenschappelijkeRegelingen'}
      <div class="alert alert-warning" role="alert" style="opacity: 0.7; position: relative; top: -100px; z-index: 10000; height: 60px; overflow: hidden; margin: 20px;">
        <strong>Let op: </strong>niet alle gemeenschappelijke regelingen staan op de kaart, zie de lijst voor een compleet overzicht.
      </div>
    {/if}
  </div>
  <div class="col-sm-12 col-lg-4">
    <div class="input-group mt-2">
      <input id="find-source" aria-label="Zoek" class="form-control" type="text" size="20" placeholder="zoek {Entity === 'GemeenschappelijkeRegelingen' ? 'Gem. regelingen' : Entity} &hellip;">
      <span class="input-group-text"><kbd>/</kbd></span>
    </div>
    {#if Entity === 'Gemeenten' && !isLive($page.url.hostname)}
    <div class="input-group mt-2">
    <input class="form-check-input" type="checkbox" on:change={load} id="onlyDetailData" bind:checked={onlyDetailData} />
    <label class="form-check-label" style="padding-left: 10px;" for="onlyDetailData">Alleen instellingen met <a href="/gegevens/detaildata">detaildata</a>.</label>
    
    </div>
    {/if}
    <div id="Sources">
      <ul class="list-unstyled mt-3" style="height: 640px; overflow: scroll;">
      {#each filteredSources as source}
        <li><a href="/gegevens/{Entity}/{source.Slug}">{Entity === 'GemeenschappelijkeRegelingen' ? source.Description : source.Title}</a></li>
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
