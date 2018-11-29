import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import {equals} from 'ramda';
import {Job} from '@enact/core/util';
import Slottable from '@enact/ui/Slottable';
import Divider from '@enact/agate/Divider';
import Button from '@enact/agate/Button';
import ToggleButton from '@enact/agate/ToggleButton';

import AppContextConnect from '../../App/AppContextConnect';
import appConfig from '../../App/configLoader';
import {propTypeLatLon, propTypeLatLonList} from '../../data/proptypes';
import CarPng from '../Dashboard/svg/car.png';

import css from './MapCore.less';

const linear = (input) => input;
const zeroPad = (val) => (val < 10 ? '0' + val : val);

const formatTime = (time) => {
	const formattedEta = new Date(time);
	const hour = formattedEta.getHours() % 12 || 12,
		min = zeroPad(formattedEta.getMinutes()),
		// sec = zeroPad(formattedEta.getSeconds()),
		ampm = (formattedEta.getHours() >= 13 ? 'PM' : 'AM');
	return `${hour}:${min} ${ampm}`;
};

// This array maps 1:1 to the durValues array below
const durationIncrements = ['day', 'hour', 'min'];
const formatDuration = (duration) => {
	duration = Math.ceil(duration);
	const durValues = [
		Math.floor(duration / (60 * 60 * 24)),  // lol we can stop at days
		Math.floor(duration / (60 * 60)) % 24,
		Math.floor(duration / 60) % 60
	];

	// It's only useful to show the two largest increments
	const durParts = [];
	for (let i = 0, useful = 0; i < durValues.length && useful < 2; i++) {
		if (durValues[i] || useful) {
			useful++;
		}
		// `zero` values are not displayed, but still counted as useful
		if (durValues[i]) {
			// stack up the number, unit, and pluralize the unit
			durParts[i] = durValues[i] + ' ' + durationIncrements[i] + (durValues[i] === 1 ? '' : 's');
		}
	}
	// Prune the empty ones and join the rest.
	return durParts.filter(part => !!part).join(' ');
};

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
	let bearing = waypoints[0].orientation || 0;
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

const locationGeoObject = {
	'type': 'Feature',
	'properties': {
		'index': null,
		'description': null
	},
	'geometry': {
		'type': 'Point',
		'coordinates': null
	}
};

const markerLayer = {
	'id': 'symbols',
	'type': 'symbol',
	'source': {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': null
		}
	},
	'layout': {
		'icon-image': 'marker-15',
		'icon-size': 3,
		'text-field': ['format', ['to-string', ['get', 'index']], {'font-scale': 0.8}]
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
	titanium: 'mapbox://styles/mapbox/light-v9'
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

		const lats = this.props.topLocations.map(loc => loc.coordinates[0]);
		const lngs = this.props.topLocations.map(loc => loc.coordinates[1]);
		this.bbox = [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];

		this.topLocations = this.props.topLocations.map((loc, idx) => {
			const location = JSON.parse(JSON.stringify(locationGeoObject));
			location.properties.index = idx + 1;
			location.properties.description = loc.description;
			location.geometry.coordinates = loc.coordinates;
			return location;
		});

		markerLayer.source.data.features = this.topLocations;
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

		this.map.fitBounds(this.bbox, {
			padding: {top: 30, bottom:30, left: 30, right: 350}
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

	panPercent ({x = 0, y = 0}) {
		// Zoom level is an logarithmic function such that increasing the level by 1 decreases the
		// viewable map by half. The following formula was derived experimentally using Mapbox's
		// reported bounds for a given zoom level. It may need to be refined after further use.
		const calcLatLngDimension = (z) => 333.27 / Math.pow(2, z - 1);
		const zoom = this.map.getZoom();
		const dim = calcLatLngDimension(zoom);
		const center = this.map.getCenter();
		const newCenter = {
			lat: center.lat + dim * y,
			lng: center.lng + dim * x
		};
		this.map.setCenter(newCenter);
	}

	panPixels ({x = 0, y = 0}) {
		const {clientWidth: w, clientHeight: h} = this.mapNode;
		this.panPercent({x: x / w, y: y / h});
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
		this.setState({carShowing: true});
		const direction = this.map.getSource('route');

		const data = await getRoute(waypoints);
		if (data.routes && data.routes[0]) {
			const route = data.routes[0];
			this.showFullRouteOnMap(waypoints);
			const startTime = new Date().getTime();
			const eta = new Date(startTime + (route.duration * 1000)).getTime();

			const travelInfo = {
				duration: route.duration,
				eta,
				startTime,
				distance: route.distance
			};

			this.props.updateNavigation(travelInfo);
			this.setState(travelInfo);

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

	// this.map.on('click', 'symbols', (e) => {
	// 	// This method is a bit messy because it now intermixes different coordinates systems
	// 	// `coordinates` comes in as Mapbox format and `startCoordinates` is latlon format.
	// 	// This could be updated, but it's marginally faster to leave it this way.
	// 	let coordinates = e.features[0].geometry.coordinates.slice();
	// 	let description = e.features[0].properties.description;

	// 	while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
	// 		coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
	// 	}

	// 	this.showPopup(coordinates, description);
	// 	this.drawDirection(startCoordinates, {lon: coordinates[0], lat: coordinates[1]});
	// 	this.centerMap({center: [(coordinates[0] + startCoordinates.lon) / 2, (coordinates[1] + startCoordinates.lat) / 2]});
	// });

	estimateRoute = (destination) => () => {
		this.drawDirection([startCoordinates, {lon: destination[0], lat: destination[1]}]);
	}

	changeFollow = () => {
		this.setState(({follow}) => ({
			follow: !follow
		}));
	}

	setMapNode = (node) => (this.mapNode = node)

	// Button options
	// <Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
	// <Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
	// <Button alt="Navigate Here" icon="play" onClick={onSetDestination} />
	// <ToggleButton alt="Follow" selected={this.state.follow} underline icon="forward" onClick={this.changeFollow} />

	render () {
		const {className, ...rest} = this.props;
		delete rest.centeringDuration;
		delete rest.destination;
		delete rest.defaultFollow;
		delete rest.location;
		delete rest.position;
		delete rest.proposedDestination;
		delete rest.setDestination;
		delete rest.skin;
		delete rest.topLocations;
		delete rest.updateNavigation;
		delete rest.viewLockoutDuration;
		delete rest.zoomToSpeedScaleFactor;
		const {duration, distance, eta} = this.state;

		return (
			<div {...rest} className={classnames(className, css.map)}>
				{this.message ? <div className={css.message}>{this.message}</div> : null}
				<div className={css.tools}>
					<Divider>TOP LOCATIONS</Divider>
					<ul>
						{
							this.topLocations && this.topLocations.map(({geometry, properties}) => {
								const {index, description} = properties;
								return <Button
									small
									key={`${description}-btn`}
									onClick={this.estimateRoute(geometry.coordinates)}
								>
									{`${index} - ${description}`}
								</Button>;
							})
						}
					</ul>
					{
						duration &&
						<div>
							<p>{formatDuration(duration)}</p>
							<p>{(distance / 1609.344).toFixed(1)} mi - {formatTime(eta)}</p>
							<ToggleButton small alt="Follow" selected={this.state.follow} underline onClick={this.changeFollow}>START NAVIGATION</ToggleButton>
						</div>
					}
				</div>
				<div
					ref={this.setMapNode}
					className={css.mapNode}
				/>
			</div>
		);
	}
}

const ConnectedMap = AppContextConnect(({location, userSettings, updateAppState}) => ({
	// We should import the app-level variable for our current location then feed that in as the "start"
	skin: userSettings.skin,
	topLocations: userSettings.topLocations,
	location,
	// destination: navigation.destination,
	setDestination: ({destination}) => {
		updateAppState((state) => {
			state.navigation.destination = destination;
		});
	},
	updateNavigation: ({duration, eta, startTime}) => {
		updateAppState((state) => {
			state.navigation.duration = duration;
			state.navigation.startTime = startTime;
			state.navigation.eta = eta;
			// console.log('updateNavigation:', state.navigation);
		});
	}
}));

const MapCore = ConnectedMap(Slottable({slots: ['tools']}, MapCoreBase));

export default MapCore;
