import Button from '@enact/agate/Button';
import classnames from 'classnames';
import {equals} from 'ramda';
import {Job} from '@enact/core/util';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import React from 'react';
import Slottable from '@enact/ui/Slottable';
import ri from '@enact/ui/resolution';

import AppContextConnect from '../../App/AppContextConnect';
import appConfig from '../../App/configLoader';
import {propTypeLatLon, propTypeLatLonList} from '../../data/proptypes';
import CarPng from '../../../assets/car.png';
import {ServiceLayerContext} from '../../data/ServiceLayer';

import css from './MapCore.less';

const linear = (input) => input;

if (!appConfig.mapApiKey) {
	Error('Please set `mapApiKey` key in your `config.js` file to your own Mapbox API key.');
}
mapboxgl.accessToken = appConfig.mapApiKey;

let startCoordinates = {lon: -122.394558, lat: 37.786600};
// 37.786600, -122.394558
// {lon: -121.979125, lat: 37.405189};


//
// Map Utilities
//
const toMapbox = (latLon) => [latLon.lon, latLon.lat];
const toLatLon = (mb) => ({lat: mb[1], lon: mb[0]});

// Takes multiple points and builds a bounds object that encompases all of them
const getBoundsOfAll = (waypoints, existingBounds) => {
	return waypoints.reduce(
		(result, coord) => result.extend(coord),
		existingBounds || new mapboxgl.LngLatBounds(waypoints[0], waypoints[0])
	);
};

const clampZoom = (zoom) => Math.min(20, Math.max(0, zoom));

const getMapPadding = () => {
	const edgeClearance = 48;
	return {
		top: ri.scale(edgeClearance),
		bottom:ri.scale(edgeClearance),
		left: ri.scale(edgeClearance),
		right: ri.scale(426 + 36 + edgeClearance) // Tools width + right edge padding + edgeClearance.
	};
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

	// Example query string we're mimicking
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

// Used in generating POIs
//
const createLocationGeoObject = (index, {description, coordinates}) => ({
	'type': 'Feature',
	'properties': {
		index,
		description
	},
	'geometry': {
		'type': 'Point',
		coordinates: toMapbox(coordinates)
	}
});

const addMarkerLayer = ({map, coordinates, updateDestination}) => {
	if (map) {
		coordinates.forEach((coor, idx) => {
			let markerElem = document.createElement('i');
			markerElem.className = css.marker;
			let markerTextElem = document.createElement('div');
			markerTextElem.innerText = idx + 1;
			markerTextElem.className = css.markerText;
			markerElem.appendChild(markerTextElem);
			new mapboxgl.Marker(markerElem)
				.setLngLat(coor)
				.addTo(map);

			markerElem.addEventListener('click', () => {
				updateDestination({
					destination: [toLatLon(coor)]
				});
			});
		});
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
					'icon-allow-overlap': true,
					'icon-ignore-placement': true,
					// rotation of the car
					'icon-rotate': orientation
				}
			};

			// If we remove the welcome screen while in the middle of an async call it throws an error.
			// For now we can just supress it as a warning.
			try {
				map.addImage('car', icon);
				map.addLayer(carLayer);
			} catch (err) {
				console.warn('Map is unmounted.', error);
			}
		});
	}
};

const skinStyles = {
	carbon: 'mapbox://styles/mapbox/dark-v9',
	copper: 'mapbox://styles/haileyr/cjq7ouqypbbcs2rqvzz11ymhd',
	'copper-day': 'mapbox://styles/mapbox/dark-v9',
	electro: '',
	titanium: 'mapbox://styles/mapbox/light-v9'
};

class MapCoreBase extends React.Component {
	static contextType = ServiceLayerContext;
	static propTypes = {
		updateDestination: PropTypes.func.isRequired,
		updateNavigation: PropTypes.func.isRequired,
		centeringDuration: PropTypes.number,
		// colorMarker: PropTypes.string,
		colorRouteLine: PropTypes.string,
		controlScheme: PropTypes.oneOf(['compact', 'full']), // 'compact' or 'full' (default is full)
		destination: propTypeLatLonList,
		follow: PropTypes.bool, // Should the centering position follow the current location?
		location: propTypeLatLon, // Our actual current location on the world
		points: PropTypes.array,
		position: propTypeLatLon, // The map's centering position
		routeRedrawInterval: PropTypes.number,
		skin: PropTypes.string,
		tools: PropTypes.node, // Buttons and tools for interacting with the map. (Slottable)
		viewLockoutDuration: PropTypes.number,
		zoomLevel: PropTypes.number, // Sets the starting zoom level for the map
		zoomToSpeedScaleFactor: PropTypes.number
	}

	static defaultProps = {
		centeringDuration: 2000,
		// colorMarker: '#445566',
		colorRouteLine: '#445566',
		controlScheme: 'full',
		points: [],
		routeRedrawInterval: 3000,
		viewLockoutDuration: 4000,
		zoomLevel: 15,
		zoomToSpeedScaleFactor: 0.02
	}

	constructor (props) {
		super(props);
		this.localinfo = {};  // A copy of queried data for quick comparisons

		// When this changes, we don't need to force a render, so we'll just save it on the instance.
		this.zoomLevel = props.zoomLevel;
		this.fullRouteShown = false;
		this.mapLoaded = false;

		this.state = {
			carShowing: true,
			selfDriving: true
		};
	}

	componentWillMount () {
		if (!mapboxgl.accessToken) {
			this.message = 'MapBox API key is not set. The map cannot be loaded.';
		}

		this.pointsList = [];
		this.points = this.props.points.map((loc, idx) => {
			this.pointsList.push(toMapbox(loc.coordinates));
			return createLocationGeoObject(idx + 1, loc);
		});
<<<<<<< HEAD
		this.bbox = getBoundsOfAll(pointsList);

		markerLayer.source.data.features = points;
=======
		this.bbox = getBoundsOfAll(this.pointsList);

		this.routeRedrawJob = setInterval(() => {
			if (this.queuedRouteRedraw) {
				this.actionManager({plotRoute: this.props.destination});
			}
		}, this.props.routeRedrawInterval);
>>>>>>> Added more themed mapbox maps and themed markers.
	}

	componentDidMount () {
		const {location, skin} = this.props;
		const style = skinStyles[skin] || skinStyles.titanium;
		if (location) {
			startCoordinates = location;
		}
		// stop drawing map if accessToken is not set.
		if (!mapboxgl.accessToken) return;

		this.map = new mapboxgl.Map({
			container: this.mapNode,
			attributionControlboolean: false,
			style,
			center: toMapbox(startCoordinates),
			zoom: this.zoomLevel
		});

		this.map.on('load', () => {
<<<<<<< HEAD
			const destination = this.props.destination;
			this.mapLoaded = true;
			this.map.addLayer(markerLayer);
=======
			addMarkerLayer({
				map: this.map,
				coordinates: this.pointsList,
				updateDestination: this.props.updateDestination
			});
>>>>>>> Added more themed mapbox maps and themed markers.
			addCarLayer({
				coordinates: toMapbox(startCoordinates),
				iconURL: CarPng,
				map: this.map,
				orientation: location.orientation
			});

			// Adds clickable targets to the map
			this.map.on('click', 'symbols', (e) => {
				let coordinates = e.features[0].geometry.coordinates.slice();
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				this.props.updateDestination({
					destination: [toLatLon(coordinates)]
				});
			});

			this.bbox = getBoundsOfAll([toMapbox(startCoordinates)], this.bbox);

			// Relates to the section above.
			this.map.fitBounds(this.bbox, {
				padding: getMapPadding()
			});

			const actions = {};
			if (destination instanceof Array && destination[destination.length - 1].lat !== 0) {
				actions.plotRoute = destination;
			}

			// If there is stuff to do, do it!
			if (Object.keys(actions).length) {
				this.actionManager(actions);
			}

			this.routeRedrawJob = setInterval(() => {
				if (this.queuedRouteRedraw) {
					this.actionManager({plotRoute: destination});
				}
			}, this.props.routeRedrawInterval);
		});

		this.setContextRef();
	}

	componentDidUpdate (prevProps) {
		if (this.props.skin !== prevProps.skin) {
			const style = skinStyles[this.props.skin] || skinStyles.titanium;
			this.map.setStyle(style);

			// make sure the map is resized after the container updates
			setTimeout(this.map.resize.bind(this.map), 0);
		}

		// `actions` is populated by a set of instructions (represented by keys) and their
		// associated arguments (represented by those keys' values). As new actions are discovered
		// they are added to the stack. Actions are processed all in one clump in a separate method.
		// This allows multiple scenarios to invoke the same action and have them not conflict with
		// each other, and have the logic of what to do abstracted from when to do it.
		const actions = {};

		// Received a new velocity
		if (this.props.location && (!prevProps.location ||
			prevProps.location.linearVelocity !== this.props.location.linearVelocity
		)) {
			if (this.props.follow) {
				actions.zoom = this.props.location.linearVelocity;
				actions.center = this.props.location;
			}
		}

		// Received a new location
		if (!equals(prevProps.location, this.props.location)) {
			// only center during following mode
			// actions.center = this.props.location;
			actions.positionCar = this.props.location;

			if (this.props.destination && this.props.destination.length > 0) {
				// We received a new location and have a destination, let's queue a new route-plot
				this.queuedRouteRedraw = true;
			}
		}

		// Received a new destination
		if (!equals(prevProps.destination, this.props.destination)) {
			// If we receive a new destination and we're already in navigating mode, update the
			// navigation destination. Technically, this does duplicate the behavior in the
			// "Staring navigation" section, but it also captures if the destination is set after
			// the navigating mode boolean is toggled.
			actions.plotRoute = this.props.destination;
			this.fullRouteShown = false;
		}

		if (!actions.center && !equals(prevProps.position, this.props.position)) {
			actions.center = this.props.position;
		}

		this.actionManager(actions);
	}

	componentWillUnmount () {
		clearInterval(this.routeRedrawJob);
		if (this.viewLockTimer) this.viewLockTimer.stop();
		this.context.onMapUnmount(this);
		if (this.map) this.map.remove();
	}

	actionManager = (actions) => {
		// guard against map actions fired from ServiceLayer before map is fully loaded
		if (!this.mapLoaded) {
			return;
		}

		for (const action in actions) {
			if (action) {
				switch (action) {
					case 'plotRoute': {
						if (actions[action]) {
							console.log('%cPlotting route to:', 'color: orange', [this.props.location, ...actions[action]]);
							this.drawDirection([this.props.location, ...actions[action]]);
						} else {
							this.removeDirection();
						}
						break;
					}
					case 'positionCar': {
						// window.requestAnimationFrame(() => this.updateCarLayer({location: actions[action]}));
						this.updateCarLayer({location: actions[action]});
						break;
					}
					case 'center': {
						this.centerMap({center: actions[action], duration: 450});
						break;
					}
					case 'zoom': {
						this.velocityZoom(actions[action]);
						break;
					}
				}
			}
		}
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

	calculateZoomLevel = (linearVelocity) => {
		// Zoom out if we're moving fast, zoom in if we're moving slowly.
		// Available zoom levels range from 0 to 20
		const vel = Math.max(0, linearVelocity);
		// console.log('calc zoom:', this.props.location.linearVelocity, this.props.location);
		return Math.abs(19 - ((vel * vel) * this.props.zoomToSpeedScaleFactor));
	}

	velocityZoom = (linearVelocity) => {
		const zoom = this.props.follow ? this.calculateZoomLevel(linearVelocity) : this.zoomLevel;
		// this.zoomMap(zoom);
		this.zoomLevel = clampZoom(zoom);
	}

	zoomMap = (zoomLevel) => {
		zoomLevel = clampZoom(zoomLevel);
		this.zoomLevel = zoomLevel;
		if (!this.viewLockTimer) {
			console.log('zoomTo:', zoomLevel);
			this.map.zoomTo(zoomLevel);
		}
	}

	zoomIn = () => {
		this.zoomMap(this.zoomLevel + 1);
	}

	zoomOut = () => {
		this.zoomMap(this.zoomLevel - 1);
	}

	centerMap = ({center = this.props.location, instant = false, duration}) => {
		// Never center the map if we're currently in view-lock
		if (!this.viewLockTimer) {
			center = (center instanceof Array) ? center : toMapbox(center);

			if (instant) {
				// console.log('jumpTo to:', center[0], center[1]);
				this.map.jumpTo({center});
			} else {
				// console.log('panTo to:', center[0], center[1]);
				// this.map.panTo(
				// 	center,
				// 	{duration: duration || 800, easing: linear, animation: true}
				// );
				this.map.flyTo(
					{
						center,
						maxDuration: this.props.centeringDuration,
						zoom: this.zoomLevel
					},
					{duration: duration || 800, easing: linear, animation: true}
				);
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
		// const bounds = waypoints.reduce((result, coord) => {
		// 	return result.extend(coord);
		// }, new mapboxgl.LngLatBounds(waypoints[0], waypoints[0]));

		const bounds = getBoundsOfAll(waypoints);

		this.map.fitBounds(bounds, {padding: getMapPadding()});
		// FitBounds adjusts the zoom level. Let's grab and store that and use it for when we adjust it manually.
		this.zoomLevel = this.map.getZoom();

		// Set a time to automatically pan back to the current position.
		if (this.viewLockTimer) this.viewLockTimer.stop();
		this.viewLockTimer = new Job(this.finishedShowingFullRouteOnMap, this.props.viewLockoutDuration);
		console.log('Starting view-lock');
		this.viewLockTimer.start();
	}

	finishedShowingFullRouteOnMap = () => {
		console.log('View-lock released!');
		if (this.viewLockTimer) this.viewLockTimer = null;
	}

	removeDirection = () => {
		const direction = this.map.getSource('route');
		if (direction) {
			direction.setData({
				type: 'Feature',
				geometry: {
					'type': 'LineString',
					'coordinates': []
				}
			});
		}
	}

	drawDirection = async (waypoints) => {
		// console.log('drawDirection:', waypoints);

		this.setState({carShowing: true});
		const data = await getRoute(waypoints);

		if (data.routes && data.routes[0]) {
			const route = data.routes[0];

			if (!this.fullRouteShown) {
				this.showFullRouteOnMap(route.geometry.coordinates);
				this.fullRouteShown = true;
			}


			// this.showFullRouteOnMap(data.routes[0].geometry.coordinates);
			// const startTime = new Date().getTime();
			// const eta = new Date(startTime + (route.duration * 1000)).getTime();
			// const travelInfo = {
			// 	duration: route.duration,
			// 	eta,
			// 	startTime,
			// 	distance: route.distance
			// };
			// this.props.updateNavigation(travelInfo);
			// this.setState(travelInfo);

			// this.showFullRouteOnMap(data.routes[0].geometry.coordinates);
			// const startTime = new Date().getTime();
			// const eta = new Date(startTime + (route.duration * 1000)).getTime();

			// const travelInfo = {
			// 	duration: route.duration,
			// 	eta,
			// 	startTime,
			// 	distance: route.distance
			// };

			// this.props.updateNavigation(travelInfo);
			// this.setState(travelInfo);

			// const routeLayer = this.map.getLayer('route');

			// If we remove the welcome screen while in the middle of an async call it throws an error.
			// For now we can just supress it as a warning.
			let direction = null;
			try {
				direction = this.map.getSource('route');
			} catch (error) {
				console.warn('Map is unmounted', error);
				return;
			}
			if (direction) {
				// if (direction) debugger;
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
					layout: {
						'line-join': 'round',
						'line-cap': 'round'
					},
					paint: {
						'line-width': 5,
						'line-color': this.props.colorRouteLine
					}
				});
			}

			this.props.updateNavigation({
				duration: route.duration,
				distance: route.distance
			});

			this.queuedRouteRedraw = false;
		} else {
			// what was in the data object anyway??
			console.log('No routes in response:', data, waypoints);
		}
	}

	// estimateRoute = ({selected}) => {
	// 	// TODO: Clear the route when deselecting a destination
	// 	if (selected == null) return;

	// 	const destination = this.points[selected].geometry.coordinates;
	// 	this.drawDirection([startCoordinates, {lon: destination[0], lat: destination[1]}]);
	// 	// this.props.updateDestination(this.points[selected]);
	// }

	setContextRef = () => {
		this.context.getMap(this);
	}

	setMapNode = (node) => (this.mapNode = node)

	// Button options
	// <Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
	// <Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
	// <Button alt="Navigate Here" icon="play" onClick={onSetDestination} />
	// <ToggleButton alt="Follow" selected={this.state.follow} underline icon="forward" onClick={this.changeFollow} />

	render () {
		const {className, controlScheme, tools, ...rest} = this.props;
		delete rest.centeringDuration;
		// delete rest.colorMarker;
		delete rest.colorRouteLine;
		delete rest.destination;
		delete rest.follow;
		delete rest.location;
		delete rest.points;
		delete rest.position;
		delete rest.skin;
		delete rest.routeRedrawInterval;
		delete rest.updateDestination;
		delete rest.updateNavigation;
		delete rest.viewLockoutDuration;
		delete rest.zoomLevel;
		delete rest.zoomToSpeedScaleFactor;

		return (
			<div {...rest} className={classnames(className, css.map)}>
				{this.message ? <div className={css.message}>{this.message}</div> : null}
				<nav className={css.tools}>
					{/* The following buttons hide if there are any other `tools` specified, which
						we need to do until we have a plan for how/where these buttons should be if
						additional tools/buttons/components are provided. */}
					{tools || controlScheme === 'compact' ? null : <div className={css.zoomControls}>
						<Button alt="Zoom in" icon="plus" onClick={this.zoomIn} />
						<Button alt="Zoom out" icon="minus" onClick={this.zoomOut} />
						{/* <Button alt="Recenter map" icon="circle" onClick={this.centerMap} /> */}
					</div>}
					{tools}
				</nav>
				<div
					ref={this.setMapNode}
					className={css.mapNode}
				/>
			</div>
		);
	}
}

const ConnectedMap = AppContextConnect(({location, userSettings}) => ({
	// colorMarker: userSettings.colorHighlight,
	colorRouteLine: userSettings.colorHighlight,
	location,
	skin: userSettings.skin
}));

const MapCore = ConnectedMap(Slottable({slots: ['tools']}, MapCoreBase));

export default MapCore;
