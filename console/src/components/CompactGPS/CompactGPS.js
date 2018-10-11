import React from 'react';
import mapboxgl from 'mapbox-gl';

// mapboxgl.accessToken = 'pk.eyJ1IjoiaGFpbGV5ciIsImEiOiJjam12N3Y3YTIweDVtM3BtenlxOXZxbjQwIn0.JV5LDLmsmx6mMMSYVb2a4Q';

const getRoute = async (start, end) => {
	const response = await window.fetch('https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken);
	return await response.json();
};

const markerLayer = {
	'id': 'symbols',
	'type': 'symbol',
	'source': {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [
				{
					'type': 'Feature',
					'properties': {
						'description': 'Tasty Subs & Pizza'
					},
					'geometry': {
						'type': 'Point',
						'coordinates': [
							-121.995479, 37.384965
						]
					}
				},
				{
					'type': 'Feature',
					'properties': {
						'description': 'Hobee\'s'
					},
					'geometry': {
						'type': 'Point',
						'coordinates': [
							-122.023559, 37.396325
						]
					}
				},
				{
					'type': 'Feature',
					'properties': {
						'description': 'Dishdash'
					},
					'geometry': {
						'type': 'Point',
						'coordinates': [
							-122.026600, 37.376994
						]
					}
				}
			]
		}
	},
	'layout': {
		'icon-image': 'rocket-15'
	}
};

class CompactGps extends React.Component {
	componentDidMount () {
		let start = [-121.979125, 37.405189];
		this.map = new mapboxgl.Map({
			container: 'map', // this.mapContainer,
			style: 'mapbox://styles/haileyr/cjn4x0ynt04jq2qpf5sb21jc5',
			center: [-121.979125, 37.405189], // starting position
			zoom: 12 // starting zoom
		});
		this.map.addControl(new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true
		}));
		this.map.on('load', () => {
			this.map.addLayer(markerLayer);
		});
		this.map.on('click', 'symbols', (e) => {
			let coordinates = e.features[0].geometry.coordinates.slice();
			let description = e.features[0].properties.description;

			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			this.showPopup(coordinates, description);
			this.drawDirection(start, coordinates);
			this.map.flyTo({center: [(coordinates[0] + start[0]) / 2, (coordinates[1] + start[1]) / 2]});
		});
	}

	componentWillUnmount () {
		this.map.remove();
	}

	showPopup (coordinates, description) {
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(description)
			.addTo(this.map);
	}

	drawDirection = async (start, end) => {
		const startPoint = this.map.getSource('start');
		const endPoint = this.map.getSource('end');
		const direction = this.map.getSource('route');
		if (startPoint) {
			startPoint.setData({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: start
				}
			});
		} else {
			this.map.addLayer({
				id: 'start',
				type: 'circle',
				source: {
					type: 'geojson',
					data: {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: start
						}
					}
				}
			});
		}
		if (endPoint) {
			endPoint.setData({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: end
				}
			});
		} else {
			this.map.addLayer({
				id: 'end',
				type: 'circle',
				source: {
					type: 'geojson',
					data: {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: end
						}
					}
				}
			});
		}

		const data = await getRoute(start, end);
		const route = data.routes[0];
		if (direction) {
			direction.setData({
				type: 'Feature',
				geometry: route.geometry
			});
		} else {
			this.map.addLayer({
				id: 'route',
				type: 'line',
				source: {
					type: 'geojson',
					data: {
						type: 'Feature',
						geometry: route.geometry
					}
				},
				paint: {
					'line-width': 2
				}
			});
		}
	}

	render () {
		const style = {
			position: 'absolute', top: 0, bottom: 0, width: '100%', color: 'black'
		};
		return <div style={style} id="map" />;
	}
}

export default CompactGps;
