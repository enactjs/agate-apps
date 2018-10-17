import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import AppContextConnect from '../../App/AppContextConnect';
import appConfig from '../../../config';

import css from './MapCore.less';

if (!appConfig.mapApiKey) {
	Error('Please set `mapApiKey` key in your `config.js` file to your own Mapbox API key.');
}
mapboxgl.accessToken = appConfig.mapApiKey;

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

class MapCoreBase extends React.Component {
	static propTypes = {
		follow: PropTypes.bool, // Should the centering position follow the current location?
		location: PropTypes.array, // Our actual current location on the world
		position: PropTypes.array, // The map's centering position
		skin: PropTypes.string
	}

	constructor (props) {
		super(props);
		this.localinfo = {};  // A copy of queried data for quick comparisons
	}

	componentWillMount () {
		if (!mapboxgl.accessToken) {
			this.message = 'MapBox API key is not set. The map cannot be loaded.';
		}
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
			this.centerMap({center: [(coordinates[0] + start[0]) / 2, (coordinates[1] + start[1]) / 2]});
		});
	}

	componentWillUpdate (nextProps) {
		if (this.props.skin !== nextProps.skin) {
			const style = skinStyles[nextProps.skin] || skinStyles.titanium;
			this.map.setStyle(style);

			// make sure the map is resized after the container updates
			setTimeout(this.map.resize.bind(this.map), 0);
		}
		// if following
		if (nextProps.follow) {
			// and the location != new location
			// OR if the map center is different from the last true center
			if (
				nextProps.location[0] !== this.props.location[0] ||
				nextProps.location[1] !== this.props.location[1] ||
				this.localinfo.center !== this.map.getCenter()) {
				// update the map, instantly
				this.centerMap({center: nextProps.location, instant: true});
			}
		} else if ((nextProps.position && this.props.position) && (nextProps.position[0] !== this.props.position[0] || nextProps.position[1] !== this.props.position[1])) {
			// else
			// and position changes
			// update map with casual fly
			this.centerMap({center: nextProps.position});
		}
	}

	componentWillUnmount () {
		if (this.map) this.map.remove();
	}

	centerMap ({center, instant = false}) {
		this.map.flyTo({center, maxDuration: (instant ? 1 : this.props.centeringDuration)});
		this.localinfo.center = this.map.getCenter(); // save a copy in their format for comparison
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
		delete rest.follow;
		return (
			<div {...rest} className={classnames(className, css.map)}>
				{this.message ? <div className={css.message}>{this.message}</div> : null}
				<div
					ref={this.setMapNode}
					className={css.mapNode}
				/>
			</div>
		);
	}
}

const SkinnableMap = AppContextConnect(({location, userSettings}) => ({
	// We should import the app-level variable for our current location then feed that in as the "start"
	skin: userSettings.skin,
	location: [location.longitude, location.latitude]
}));

const MapCore = SkinnableMap(MapCoreBase);

export default MapCore;
