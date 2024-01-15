<script>
	import LeafletMap from '../../../lib/LeafletMap.svelte'
	import L from 'leaflet';
	// @ts-ignore
	import _p from 'leaflet.markercluster';

	export let data;

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
		map = L.map('map').setView([52.747778, 6.296667], 8);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		var markers = L.markerClusterGroup();
		data.bindings.forEach((binding) => {
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
		});
		map?.addLayer(markers);
		document.getElementById('map')?.classList.remove('loading')

		return map;
	};
</script>

<h1>Overzicht per Gemeente</h1>
<LeafletMap {mapAction}/>
