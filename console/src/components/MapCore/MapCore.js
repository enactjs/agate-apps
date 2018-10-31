import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import {Job} from '@enact/core/util';

import AppContextConnect from '../../App/AppContextConnect';
import appConfig from '../../../config';
import CarSvg from '../Dashboard/svg/car.svg';

import css from './MapCore.less';

const linear = (input) => input;

if (!appConfig.mapApiKey) {
	Error('Please set `mapApiKey` key in your `config.js` file to your own Mapbox API key.');
}
mapboxgl.accessToken = appConfig.mapApiKey;

const propTypeLatLon = PropTypes.shape({
	lat: PropTypes.number,
	lon: PropTypes.number
});


//
// Map Utilities
//
const toMapbox = (latLon) => [latLon.lon, latLon.lat];
const toLatLon = (mb) => ({lat: mb[1], lon: mb[0]});
const toDeg = (rad) => (rad * 180 / Math.PI);

const newBounds = (point1, point2) => {
	// Takes two arbitrary points and determines the southwest most and northeast most coordinates that contain them
	const corner1 = [point1.lon, point1.lat];
	const corner2 = [point2.lon, point2.lat];
	if (point2.lon < point1.lon) {
		corner1[0] = point2.lon;
		corner2[0] = point1.lon;
	}
	if (point2.lat < point1.lat) {
		corner1[1] = point2.lat;
		corner2[1] = point1.lat;
	}
	return new mapboxgl.LngLatBounds(corner1, corner2);
};

const buildQueryString = (props) => {
	const pairs = [];
	for (const key in props) {
		let value = props[key];
		if (value instanceof Array) {
			value = value.join(';');
		}
		pairs.push(key + '=' + encodeURIComponent(value));
	}
	return pairs.join('&');
};

//
// Get Directions
//
const getRoute = async (start, end) => {
	const startMb = toMapbox(start);
	const endMb = toMapbox(end);
	let bearing = toDeg(start.orientation);
	if (bearing < 0) bearing += 360;

	// geometries=geojson&bearings=${bearing},45;&radiuses=100;100&access_token=${mapboxgl.accessToken}
	const qs = buildQueryString({
		geometries: 'geojson',
		bearings: [`${bearing},45`, null],
		radiuses: [100, 100],
		access_token: mapboxgl.accessToken // eslint-disable-line camelcase
	});
	// console.log('qs:', qs);
	const response = await window.fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startMb[0]},${startMb[1]};${endMb[0]},${endMb[1]}?${qs}`);
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
		updateNavigation: PropTypes.func.isRequired,
		centeringDuration: PropTypes.number,
		follow: PropTypes.bool, // Should the centering position follow the current location?
		location: propTypeLatLon, // Our actual current location on the world
		position: propTypeLatLon, // The map's centering position
		skin: PropTypes.string,
		viewLockoutDuration: PropTypes.number,
		zoomToSpeedScaleFactor: PropTypes.number
	}

	static defaultProps = {
		centeringDuration: 2000,
		viewLockoutDuration: 4000,
		zoomToSpeedScaleFactor: 5
	}

	constructor (props) {
		super(props);
		this.localinfo = {};  // A copy of queried data for quick comparisons

		this.state = {
			carShowing: true
		};
	}

	componentWillMount () {
		if (!mapboxgl.accessToken) {
			this.message = 'MapBox API key is not set. The map cannot be loaded.';
		}
	}

	componentDidMount () {
		const style = skinStyles[this.props.skin] || skinStyles.titanium;
		const start = {lon: -121.979125, lat: 37.405189};

		// stop drawing map if accessToken is not set.
		if (!mapboxgl.accessToken) return;

		this.map = new mapboxgl.Map({
			container: this.mapNode,
			style,
			center: toMapbox(start),
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
			// This method is a bit messy because it now intermixes different coordinates systems
			// `coordinates` comes in as Mapbox format and `start` is latlon format.
			// This could be updated, but it's marginally faster to leave it this way.
			let coordinates = e.features[0].geometry.coordinates.slice();
			let description = e.features[0].properties.description;

			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			this.showPopup(coordinates, description);
			this.drawDirection(start, {lon: coordinates[0], lat: coordinates[1]});
			this.centerMap({center: [(coordinates[0] + start.lon) / 2, (coordinates[1] + start.lat) / 2]});
		});
	}

	componentDidUpdate (nextProps) {
		if (this.props.skin !== nextProps.skin) {
			const style = skinStyles[nextProps.skin] || skinStyles.titanium;
			this.map.setStyle(style);

			// make sure the map is resized after the container updates
			setTimeout(this.map.resize.bind(this.map), 0);
		}

		// if following
		if (nextProps.follow) {
			// Received a new location
			// and the location != new location
			// OR if the map center is different from the last true center
			if (
				nextProps.location.lat !== this.props.location.lat ||
				nextProps.location.lon !== this.props.location.lon ||
				nextProps.location.orientation !== this.props.location.orientation ||
				this.localinfo.center !== this.map.getCenter()) {
				// update the map, instantly
				this.centerMap({center: nextProps.location});
				this.orientCarImage(nextProps.location.orientation);
			}
			// Received a new destination
			if (
				nextProps.destination.lat !== this.props.destination.lat ||
				nextProps.destination.lon !== this.props.destination.lon
			) {
				// update the map, instantly
				this.drawDirection(nextProps.location, this.props.destination);
			}
		} else if (
			(nextProps.position && this.props.position) &&
			(
				nextProps.position.lat !== this.props.position.lat ||
				nextProps.position.lon !== this.props.position.lon
			)) {
			// else
			// and position changes
			// update map with casual fly
			this.centerMap({center: nextProps.position});
		}
	}

	componentWillUnmount () {
		this.map.remove();
	}

	calculateZoomLevel = () => {
		// Zoom out if we're moving fast, zoom in if we're moving slowly.
		// Available zoom levels range from 0 to 20
		const vel = Math.max(0, this.props.location.linearVelocity);
		// console.log('calc zoom:', this.props.location.linearVelocity, this.props.location);
		return Math.abs(20 - ((vel * vel) * this.props.zoomToSpeedScaleFactor));
	}

	centerMap = ({center, instant = false}) => {
		// Never center the map if we're currently in view-lock
		if (!this.viewLockTimer) {
			center = (center instanceof Array) ? center : toMapbox(center);

			const zoom = this.props.follow ? this.calculateZoomLevel() : 15;

			if (instant) {
				this.map.jumpTo({center});
			} else {
				// console.log('centerMap to:', center[0], center[1], center, 'zoom:', zoom);
				this.map.flyTo(
					{
						center,
						// maxDuration: this.props.centeringDuration,
						zoom
					},
					// {duration: (instant ? 500 : 500)}
					{duration: 800, easing: linear, animation: true}
				);
			}
			// this.map.flyTo({center, maxDuration: (instant ? 500 : this.props.centeringDuration)});
			this.localinfo.center = toLatLon(this.map.getCenter()); // save the current center, based on their truth rather than ours
		}
	}

	orientCarImage = (orientation) => {
		this.carNode.style.setProperty('--map-orientation', orientation);
	}

	showPopup = (coordinates, description) => {
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(description)
			.addTo(this.map);
	}

	showFullRouteOnMap = (start, end) => {
		const bounds = newBounds(start, end);
		this.map.fitBounds(bounds);

		// Set a time to automatically pan back to the current position.
		if (this.viewLockTimer) this.viewLockTimer.stop();
		this.viewLockTimer = new Job(this.finishedShowingFullRouteOnMap, this.props.viewLockoutDuration);
		// console.log('Starting view-lock');
		this.viewLockTimer.start();
	}

	finishedShowingFullRouteOnMap = () => {
		// console.log('View-lock released!');
		if (this.viewLockTimer) this.viewLockTimer.stop();
	}

	drawDirection = async (start, end) => {
		// const startMb = toMapbox(start);
		const endMb = toMapbox(end);

		this.setState({carShowing: true});

		// const startPoint = this.map.getSource('start');
		const endPoint = this.map.getSource('end');
		const direction = this.map.getSource('route');
		// if (startPoint) {
		// 	startPoint.setData({
		// 		type: 'Feature',
		// 		geometry: {
		// 			type: 'Point',
		// 			coordinates: start
		// 		}
		// 	});
		// } else {
		// 	this.map.addLayer({
		// 		id: 'start',
		// 		type: 'circle',
		// 		source: {
		// 			type: 'geojson',
		// 			data: {
		// 				type: 'Feature',
		// 				geometry: {
		// 					type: 'Point',
		// 					coordinates: start
		// 				}
		// 			}
		// 		}
		// 	});
		// }
		if (endPoint) {
			endPoint.setData({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: endMb
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
							coordinates: endMb
						}
					}
				}
			});
		}

		const data = await getRoute(start, end);
		if (data.routes) {
			const route = data.routes[0];
			// console.log('Route:', start, end);
			this.showFullRouteOnMap(start, end);

			this.props.updateNavigation({
				duration: route.duration
			});

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
						'line-width': 3
					}
				});
			}
		} else {
			// wtf was in the data object anyway??
			console.log('No routes in response:', data);
		}
	}

	setCarNode = (node) => (this.carNode = node)
	setMapNode = (node) => (this.mapNode = node)

	render () {
		const {className, ...rest} = this.props;
		delete rest.centeringDuration;
		delete rest.follow;
		delete rest.location;
		delete rest.position;
		delete rest.skin;
		delete rest.updateNavigation;
		delete rest.viewLockoutDuration;
		delete rest.zoomToSpeedScaleFactor;
		return (
			<div {...rest} className={classnames(className, css.map)}>
				{this.message ? <div className={css.message}>{this.message}</div> : null}
				<img className={classnames(css.carImage, (this.state.carShowing ? null : css.hidden))} ref={this.setCarNode} src={CarSvg} alt="" />
				<div
					ref={this.setMapNode}
					className={css.mapNode}
				/>
			</div>
		);
	}
}

const SkinnableMap = AppContextConnect(({navigation, location, userSettings, updateAppState}) => ({
	// We should import the app-level variable for our current location then feed that in as the "start"
	skin: userSettings.skin,
	location,
	destination: navigation.destination,
	updateNavigation: ({duration}) => {
		updateAppState((state) => {
			const now = new Date().getTime();
			state.navigation.duration = duration;
			state.navigation.startTime = now;
			state.navigation.eta = new Date(now + (duration * 60000)).getTime();
			// console.log('updateNavigation:', state.navigation);
		});
	}
}));

const MapCore = SkinnableMap(MapCoreBase);

export default MapCore;
