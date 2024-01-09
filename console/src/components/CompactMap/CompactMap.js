/*global google*/

import Button from "@enact/agate/Button";
import Skinnable from '@enact/agate/Skinnable';
import kind from '@enact/core/kind';
import {APIProvider, Map, Marker, useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

import MapController from '../MapController';
import Widget from '../Widget';

import css from './CompactMap.module.less';

const position = {lat: 46.770221, lng: 23.597034};
const apiKey = 'AIzaSyAkRIiwdXhOui18ZPV-9BBAbUdHA8xQtpM';

const CompactMapBase = kind({
	name: 'CompactMap',

	propTypes: {
		follow: PropTypes.bool,
		onExpand: PropTypes.func
	},

	styles: {
		css,
		className: 'compactMap'
	},

	render: ({follow, onExpand, ...rest}) => {
		return (
			<Widget {...rest} icon="compass" title="Map" description="Choose a destination and navigate" noHeader>
				<small>
					<MapController
						controlScheme="compact"
						follow={follow}
						onExpand={onExpand}
					/>
				</small>
				<large>
					{/*<MapController*/}
					{/*	controlScheme="compact"*/}
					{/*	locationSelection*/}
					{/*	autonomousSelection*/}
					{/*	follow={follow}*/}
					{/*	onExpand={onExpand}*/}
					{/*>*/}
					{/*	/!* <tools>*/}
					{/*		<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />*/}
					{/*		<Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />*/}
					{/*		<Button alt="Navigate Here" icon="play" onClick={onSetDestination} />*/}
					{/*	</tools>*!/*/}
					{/*</MapController>*/}

					<APIProvider apiKey={apiKey}>
						<Map
							center={position}
							fullscreenControl={false}
							zoom={10}>
							{/*<Marker position={position} />*/}
							<Directions></Directions>
						</Map>
					</APIProvider>
				</large>
			</Widget>
		);
	}
});

function Directions() {
	const map = useMap();
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] = useState();
	const [directionsRenderer, setDirectionsRenderer] = useState();
	const [routes, setRoutes] = useState([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];

	useEffect(() => {
		if(!routesLibrary || !map) return;
		setDirectionsService(new routesLibrary.DirectionsService());
		setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
	}, [routesLibrary, map]);

	useEffect(() => {
		if (!directionsRenderer || !directionsService) return;

		directionsService.route({
			origin: "strada Buna Ziua 39, Cluj-Napoca",
			destination: "Emerson Cluj",
			travelMode: google.maps.TravelMode.DRIVING,
			provideRouteAlternatives: true
		})
			.then((response) => {
				directionsRenderer.setDirections(response)
				setRoutes(response.routes);
			})

	}, [directionsService, directionsRenderer]);
	console.log(routes);


	// Update direction route
	useEffect(() => {
		if (!directionsRenderer) return;
		directionsRenderer.setRouteIndex(routeIndex);
	}, [routeIndex, directionsRenderer]);

	if (!leg) return null;

	return (
		<div className={css.directions}>
			<h4>{selected.summary}</h4>
			<div>
				{leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
			</div>
			<div>Distance: {leg.distance?.text}</div>
			<div>Duration: {leg.duration?.text}</div>

			<h4>Other Routes</h4>
			<ul>
				{routes.map((route, index) => (
					<li key={route.summary}>
						<Button onClick={() => setRouteIndex(index)}>
							{route.summary}
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}


const CompactMap = Skinnable(CompactMapBase);

export default CompactMap;
