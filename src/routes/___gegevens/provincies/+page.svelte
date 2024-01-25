<script>
	import LeafletMap from '../../../lib/LeafletMap.svelte'
	import L from 'leaflet';
  export let data;
	// @ts-ignore
	// import loadData from './data'
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
		document.getElementById('map')?.classList.add('loading')
		map = L.map('map').setView([52.747778, 6.296667], 7);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);
    if (map) L.geoJSON(data.provinces).addTo(map);

		data.bindings.forEach((binding) => {
			var flag = L.icon({
				iconUrl: binding.vlag.value,
				iconSize: [60, 25],
			});
			const point = binding.location.value
				.replace(/^point\((.+)\)$/i, '$1')
				.split(' ')
				.map((/** @type {string} */ el) => parseFloat(el))
				.reverse();

			const marker = L.marker(new L.LatLng(point[0], point[1]), {icon: flag})
			marker.bindPopup(`
				${binding.provincieLabel.value}
				<br><a href="/gegevens/provincies/${binding.provincieLabel.value}">Ga naar gegevens &raquo;</a>
				`);
			if (map) marker.addTo(map);
		})
		return map;
	};
</script>

<h1>Overzicht per Provincie</h1>
<LeafletMap {mapAction}/>
