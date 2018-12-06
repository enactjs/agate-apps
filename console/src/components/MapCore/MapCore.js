import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import {equals, compose} from 'ramda';
import {Job} from '@enact/core/util';
import Slottable from '@enact/ui/Slottable';
import ToggleButton from '@enact/agate/ToggleButton';

import AppContextConnect from '../../App/AppContextConnect';
import appConfig from '../../App/configLoader';
import {propTypeLatLon, propTypeLatLonList} from '../../data/proptypes';
import CarPng from '../Dashboard/svg/car.png';
import ServiceLayer from '../../data/ServiceLayer';

import css from './MapCore.less';

const linear = (input) => input;

if (!appConfig.mapApiKey) {
	Error('Please set `mapApiKey` key in your `config.js` file to your own Mapbox API key.');
}
mapboxgl.accessToken = appConfig.mapApiKey;

const startCoordinates = {lon: -121.979125, lat: 37.405189};

//
// Map Utilities
//
const toMapbox = (latLon) => [latLon.lon, latLon.lat];
const toLatLon = (mb) => ({lat: mb[1], lon: mb[0]});

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
const getRoute = async (waypoints) => {
	let bearing = waypoints[0].orientation;
	if (bearing < 0) bearing += 360;

	// Take the list of LatLon objects and convert each to a string of "x,y", then join those with a ";"
	const waypointParts = waypoints.map(point => toMapbox(point).join(','));
	const waypointString = waypointParts.join(';');

	// geometries=geojson&bearings=${bearing},45;&radiuses=100;100&access_token=${mapboxgl.accessToken}
	const qs = buildQueryString({
		geometries: 'geojson',
		bearings: [`${bearing},45`, ...Array(waypointParts.length - 1).fill(null)],
		radiuses: [100, ...Array(waypointParts.length - 1).fill(100)],
		access_token: mapboxgl.accessToken // eslint-disable-line camelcase
	});
	// console.log('qs:', qs);
	const response = await window.fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${waypointString}?${qs}`);
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

const carLayerId = 'carPoint';
const addCarLayer = ({coordinates, iconURL, map, orientation = 0}) => {
	if (map) {
		// upload png (svg does not work)
		map.loadImage(iconURL, (error, icon) => {
			if (error) throw error;

			const carLayer = {
				'id': carLayerId,
				'type': 'symbol',
				'source': {
					'type': 'geojson',
					'data': {
						'type': 'FeatureCollection',
						'features': [{
							'type': 'Feature',
							'geometry': {
								'type': 'Point',
								// location of the car
								'coordinates': coordinates
							}
						}]
					}
				},
				'layout': {
					'icon-image': 'car',
					'icon-size': 0.10,
					// rotation of the car
					'icon-rotate': orientation
				}
			};

			map.addImage('car', icon);
			map.addLayer(carLayer);
		});
	}
};

const skinStyles = {
	carbon: 'mapbox://styles/mapbox/dark-v9',
	electro: '',
	titanium: 'mapbox://styles/haileyr/cjn4x0ynt04jq2qpf5sb21jc5'
};

class MapCoreBase extends React.Component {
	static propTypes = {
		setDestination: PropTypes.func.isRequired,
		updateNavigation: PropTypes.func.isRequired,
		centeringDuration: PropTypes.number,
		defaultFollow: PropTypes.bool, // Should the centering position follow the current location?
		destination:propTypeLatLonList,
		location: propTypeLatLon, // Our actual current location on the world
		position: propTypeLatLon, // The map's centering position
		proposedDestination: propTypeLatLonList,
		skin: PropTypes.string,
		tools: PropTypes.node, // Buttons and tools for interacting with the map. (Slottable)
		viewLockoutDuration: PropTypes.number,
		zoomToSpeedScaleFactor: PropTypes.number
	}

	static defaultProps = {
		centeringDuration: 2000,
		viewLockoutDuration: 4000,
		zoomToSpeedScaleFactor: 0.02
	}

	constructor (props) {
		super(props);
		this.localinfo = {};  // A copy of queried data for quick comparisons

		this.state = {
			carShowing: true,
			follow: props.defaultFollow || false
		};
	}

	componentWillMount () {
		if (!mapboxgl.accessToken) {
			this.message = 'MapBox API key is not set. The map cannot be loaded.';
		}
	}

	componentDidMount () {
		const style = skinStyles[this.props.skin] || skinStyles.titanium;

		// stop drawing map if accessToken is not set.
		if (!mapboxgl.accessToken) return;

		this.map = new mapboxgl.Map({
			container: this.mapNode,
			attributionControlboolean: false,
			style,
			center: toMapbox(startCoordinates),
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
			addCarLayer({
				coordinates: toMapbox(startCoordinates),
				iconURL: CarPng,
				map: this.map,
				orientation: this.props.location.orientation
			});
		});

		this.map.on('click', 'symbols', (e) => {
			// This method is a bit messy because it now intermixes different coordinates systems
			// `coordinates` comes in as Mapbox format and `startCoordinates` is latlon format.
			// This could be updated, but it's marginally faster to leave it this way.
			let coordinates = e.features[0].geometry.coordinates.slice();
			let description = e.features[0].properties.description;

			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			this.showPopup(coordinates, description);
			this.drawDirection(startCoordinates, {lon: coordinates[0], lat: coordinates[1]});
			this.centerMap({center: [(coordinates[0] + startCoordinates.lon) / 2, (coordinates[1] + startCoordinates.lat) / 2]});
		});
	}

	componentDidUpdate (prevProps) {
		if (this.props.skin !== prevProps.skin) {
			const style = skinStyles[prevProps.skin] || skinStyles.titanium;
			this.map.setStyle(style);

			// car layer needs to be added everytime the map reloaded when skin changes
			addCarLayer({
				coordinates: toMapbox(startCoordinates),
				iconURL: CarPng,
				map: this.map,
				orientation: this.props.location.orientation
			});

			// make sure the map is resized after the container updates
			setTimeout(this.map.resize.bind(this.map), 0);
		}

		// `actions` is populated by a set of instructions (represented by keys) and their
		// associated arguments (represented by those keys' values). As new actions are discovered
		// they are added to the stack. Actions are processed all in one clump in a separate method.
		// This allows multiple scenarios to invoke the same action and have them not conflict with
		// each other, and have the logic of what to do abstracted from when to do it.
		const actions = {};

		// Received a new orientation

		// Received a new proposedDestination
		if (!equals(prevProps.proposedDestination, this.props.proposedDestination)) {
			actions.plotRoute = [this.props.location, ...this.props.proposedDestination];
		}

		// Received a new velocity
		if (this.props.location && (!prevProps.location ||
			prevProps.location.linearVelocity !== this.props.location.linearVelocity
		)) {
			actions.zoom = this.props.location.linearVelocity;
		}

		// Received a new location
		if (!equals(prevProps.location, this.props.location)) {
			actions.center = this.props.location;
			actions.positionCar = this.props.location;
		}

		// Received a new destination
		if (!equals(prevProps.destination, this.props.destination)) {
			console.log('Initiating navigation to a new destination:', this.props.destination);
			actions.plotRoute = [this.props.location, ...this.props.destination];
			actions.startNavigating = this.props.destination;
		}

		if (!actions.center && !equals(prevProps.position, this.props.position)) {
			actions.center = this.props.position;
		}

		this.actionManager(actions);
	}

	componentWillUnmount () {
		if (this.map) this.map.remove();
	}

	actionManager = (actions) => {
		for (const action in actions) {
			if (action) {
				switch (action) {
					case 'plotRoute': {
						this.drawDirection(actions[action]);
						break;
					}
					case 'startNavigating': {
						this.props.setDestination({destination: actions[action]});
						break;
					}
					case 'positionCar': {
						this.updateCarLayer({location: actions[action]});
						break;
					}
					case 'center': {
						this.centerMap({center: actions[action]});
						break;
					}
					case 'zoom': {
						// if following
						// if (this.props.follow) {

						this.velocityZoom(actions[action]);
						break;
					}
				}
			}
		}
	}

	calculateZoomLevel = (linearVelocity) => {
		// Zoom out if we're moving fast, zoom in if we're moving slowly.
		// Available zoom levels range from 0 to 20
		const vel = Math.max(0, linearVelocity);
		// console.log('calc zoom:', this.props.location.linearVelocity, this.props.location);
		return Math.abs(19 - ((vel * vel) * this.props.zoomToSpeedScaleFactor));
	}

	velocityZoom = (linearVelocity) => {
		if (!this.viewLockTimer) {
			const zoom = this.state.follow ? this.calculateZoomLevel(linearVelocity) : 15;
			console.log('zoomTo:', zoom);
			this.map.zoomTo(zoom);
		}
	}

	centerMap = ({center, instant = false}) => {
		// Never center the map if we're currently in view-lock
		if (!this.viewLockTimer) {
			center = (center instanceof Array) ? center : toMapbox(center);


			if (instant) {
				this.map.jumpTo({center});
			} else {
				// console.log('centerMap to:', center[0], center[1], center);
				this.map.panTo(
					center,
					{duration: 800, easing: linear, animation: true}
				);
				// this.map.flyTo(
				// 	{
				// 		center,
				// 		// maxDuration: this.props.centeringDuration,
				// 		zoom
				// 	},
				// 	// {duration: (instant ? 500 : 500)}
				// 	{duration: 800, easing: linear, animation: true}
				// );
			}
			// this.map.flyTo({center, maxDuration: (instant ? 500 : this.props.centeringDuration)});
			this.localinfo.center = toLatLon(this.map.getCenter()); // save the current center, based on their truth rather than ours
		}
	}

	updateCarLayer = ({location}) => {
		if (this.map) {
			const carLayer = this.map.getSource(carLayerId);
			if (carLayer) {
				const coords = toMapbox(location);
				const newCarData = {
					'type': 'FeatureCollection',
					'features': [{
						'type': 'Feature',
						'geometry': {
							'type': 'Point',
							'coordinates': coords
						}
					}]
				};

				// update coordinates of the car
				carLayer.setData(newCarData);
				// update the car orientation
				this.map.setLayoutProperty(carLayerId, 'icon-rotate', location.orientation);
			}
		}
	}

	showPopup = (coordinates, description) => {
		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(description)
			.addTo(this.map);
	}

	showFullRouteOnMap = (waypoints) => {
		// Currently we're just looking at the first and last waypoint, but this could be expanded
		// to calculate the farthest boundry and plot that.
		const bounds = newBounds(waypoints[0], waypoints[waypoints.length - 1]);
		this.map.fitBounds(bounds, {padding: 50});

		// Set a time to automatically pan back to the current position.
		if (this.viewLockTimert) this.viewLockTimer.stop();
		this.viewLockTimer = new Job(this.finishedShowingFullRouteOnMap, this.props.viewLockoutDuration);
		// console.log('Starting view-lock');
		this.viewLockTimer.start();
	}

	finishedShowingFullRouteOnMap = () => {
		console.log('View-lock released!');
		if (this.viewLockTimer) this.viewLockTimer = null;
	}

	drawDirection = async (waypoints) => {
		const endMb = toMapbox(waypoints[waypoints.length - 1]);  // Get the last point

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

		const data = await getRoute(waypoints);
		if (data.routes && data.routes[0]) {
			const route = data.routes[0];
			this.showFullRouteOnMap(waypoints);

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
			console.log('No routes in response:', data, waypoints);
		}
	}

	changeFollow = () => {
		this.setState(({follow}) => ({
			follow: !follow
		}));
	}

	setMapNode = (node) => (this.mapNode = node)

	render () {
		const {className, tools, ...rest} = this.props;
		delete rest.centeringDuration;
		delete rest.destination;
		delete rest.defaultFollow;
		delete rest.location;
		delete rest.position;
		delete rest.proposedDestination;
		delete rest.setDestination;
		delete rest.skin;
		delete rest.updateNavigation;
		delete rest.viewLockoutDuration;
		delete rest.zoomToSpeedScaleFactor;
		return (
			<div {...rest} className={classnames(className, css.map)}>
				{this.message ? <div className={css.message}>{this.message}</div> : null}
				<nav className={css.tools}>
					{tools}
					<ToggleButton alt="Follow" selected={this.state.follow} underline icon="forward" onClick={this.changeFollow} />
				</nav>
				<div
					ref={this.setMapNode}
					className={css.mapNode}
				/>
			</div>
		);
	}
}

const ConnectedMap = compose(
	AppContextConnect(({location, userSettings, updateAppState}) => ({
		location,
		// We should import the app-level variable for our current location then feed that in as the "start"
		skin: userSettings.skin,
		// destination: navigation.destination,
		setDestination: ({destination}) => {
			updateAppState((state) => {
				state.navigation.destination = destination;
			});
		},
		updateNavigation: ({duration}) => {
			const now = new Date().getTime();
			const eta = new Date(now + (duration * 1000)).getTime();
			updateAppState((state) => {
				state.navigation.duration = duration;
				state.navigation.startTime = now;
				state.navigation.eta = eta;
				// console.log('updateNavigation:', state.navigation);
			});
		}
	}))
);

const MapCore = ConnectedMap(Slottable({slots: ['tools']}, MapCoreBase));

export default MapCore;
