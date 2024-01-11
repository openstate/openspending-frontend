<script>
	import L from 'leaflet';
	// @ts-ignore
	import loadData from './data'
	import _p from 'leaflet.markercluster';

	/**
	 * @type {L.Map | L.LayerGroup<any> | null}
	 */
	let map;

	function mapAction(/** @type {HTMLDivElement} */ _e) {
		map = createMap();
		return {
			destroy: () => {
				map?.remove();
				map = null;
			}
		};
	}

	const createMap = () => {
		map = L.map('map').setView([52.747778, 6.296667], 8);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		loadData()
			.then((/** @type {any[]} */ bindings) => {
				var markers = L.markerClusterGroup();
				bindings.forEach((binding) => {
					const point = binding.location.value
						.replace(/^point\((.+)\)$/i, '$1')
						.split(' ')
						.map((/** @type {string} */ el) => parseFloat(el))
						.reverse();
					var marker = L.marker(new L.LatLng(point[0], point[1]), {
						title: `${binding.provincieLabel.value} | ${binding.gemeenteLabel.value}`
					});
					marker.bindPopup(`
          ${binding.vlag ? `<img src="${binding.vlag.value}" style="width: 250px;"><br>` : ''}
          ${binding.gemeenteLabel.value}
          <br>${binding.provincieLabel.value}
          <br><a href="/gegevens/provincies/${binding.provincieLabel.value}/gemeenten/${
						binding.gemeenteLabel.value
					}">Ga naar gegevens &raquo;</a>
          `);
					markers.addLayer(marker);
					console.log(marker);
				});
				map?.addLayer(markers);
			})
			.catch((e) => {
				console.log(e);
			});

		return map;
	};
</script>

<h1>Overzicht per Gemeente</h1>
<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"
	/>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"
	/>
</svelte:head>

<div id="map" style="height: 600px;" use:mapAction></div>
