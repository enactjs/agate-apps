import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import AppContextConnect from '../../App/AppContextConnect';

import css from './CompactMap.less';

if (!process.env.REACT_APP_MAPBOX) { // eslint-disable-line
	console.error('Please set environment variable REACT_APP_MAPBOX to your own Mapbox API key when you start the app.');
}
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX; // eslint-disable-line

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

const skinStyles = {
	carbon: 'mapbox://styles/mapbox/dark-v9',
	electro: '',
	titanium: 'mapbox://styles/haileyr/cjn4x0ynt04jq2qpf5sb21jc5'
};

class CompactMapBase extends React.Component {
	static propTypes = {
		skin: PropTypes.string
	}

	componentDidMount () {
		const style = skinStyles[this.props.skin] || skinStyles.titanium;
		const start = [-121.979125, 37.405189];

		// stop drawing map if accessToken is not set.
		if (!mapboxgl.accessToken) return;

		this.map = new mapboxgl.Map({
			container: this.mapNode,
			style,
			center: start,
			zoom: 12
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

	componentWillUpdate (nextProps) {
		if (this.props.skin !== nextProps.skin) {
			const style = skinStyles[nextProps.skin] || skinStyles.titanium;
			this.map.setStyle(style);

			// make sure the map is resized after the container updates
			setTimeout(this.map.resize.bind(this.map), 0);
		}
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

	setMapNode = (node) => (this.mapNode = node)

	render () {
		const {className, ...rest} = this.props;
		return (
			<div
				{...rest}
				ref={this.setMapNode}
				className={classnames(className, css.map)}
			/>
		);
	}
}

const SkinnableMap = AppContextConnect(({userSettings}) => ({
	skin: userSettings.skin
}));

const CompactMap = SkinnableMap(CompactMapBase);

export default CompactMap;
