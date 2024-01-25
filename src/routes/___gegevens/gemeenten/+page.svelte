<script>
	import LeafletMap from '../../../lib/LeafletMap.svelte'
	import { load } from './load'
	import L from 'leaflet';

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

		load(map).then(_ => document.getElementById('map')?.classList.remove('loading'))
		return map;
	};
</script>

<h1>Overzicht per Gemeente</h1>
<LeafletMap {mapAction}/>
