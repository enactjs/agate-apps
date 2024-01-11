/*global google*/

import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import Skinnable from "@enact/ui/Skinnable";
import {APIProvider, Map, Marker, useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {useEffect, useState} from 'react';

import appConfig from '../../App/configLoader';

import css from './GoogleMaps.module.less';

if (!appConfig.googleMapsApiKey) {
	Error('Please set `googleMapsApiKey` key in your `config.js` file to your own Google Maps API key.');
}

const position = {lat: 46.770221, lng: 23.597034};

const DestinationButton = (props) => {
	const {children, 'data-index': index, ...rest} = props;
	return <Button size="small" {...rest} css={css}>
		<Marker css={css}>{index + 1}</Marker>
		{children}
	</Button>;
};

const GoogleMapsBase = kind({
	name: 'GoogleMaps',

	propTypes: {
	},

	styles: {
		css,
		className: 'googleMaps'
	},

	render: ({
		...rest
	}) => {

		return (
			<>
				<APIProvider apiKey={appConfig.googleMapsApiKey}>
					<Map
						center={position}
						fullscreenControl={false}
						zoom={8}>
						{/*<Marker position={position} />*/}
						<Directions></Directions>
					</Map>
				</APIProvider>
			</>
		);
	}
});


const destinations = [
	'Iulius Mall Cluj',
	'Vivo Cluj',
	'Platinia Cluj'
]

function Directions() {
	const map = useMap();
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] = useState();
	const [directionsRenderer, setDirectionsRenderer] = useState();
	const [routes, setRoutes] = useState([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];
	const [destination, setDestination] = useState(destinations[0]);

	useEffect(() => {
		if(!routesLibrary || !map) return;
		setDirectionsService(new routesLibrary.DirectionsService());
		setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
	}, [routesLibrary, map]);

	useEffect(() => {
		if (!directionsRenderer || !directionsService) return;

		directionsService.route({
			origin: "strada Buna Ziua 39, Cluj-Napoca",
			destination: destination,
			travelMode: google.maps.TravelMode.DRIVING,
			provideRouteAlternatives: true
		})
			.then((response) => {
				directionsRenderer.setDirections(response)
				setRoutes(response.routes);
			})

	}, [directionsService, directionsRenderer, destination]);

	// Update direction route
	useEffect(() => {
		if (!directionsRenderer) return;
		directionsRenderer.setRouteIndex(routeIndex);
	}, [routeIndex, directionsRenderer, destination]);

	if (!leg) return null;

	return (
		<div className={css.directions}>

			{/*<Group*/}
			{/*	component="div"*/}
			{/*	childComponent={DestinationButton}*/}
			{/*	onSelect={handleSetDestination}*/}
			{/*	selectedProp="highlighted"*/}
			{/*	selected={selected}*/}
			{/*>*/}
			{/*	{*/}
			{/*		destinations.map((destination) => destination)*/}
			{/*	}*/}
			{/*</Group>*/}

			<ul>
				{destinations.map((destination) => (
					<li >
						<button onClick={() => setDestination(destination)}>
							{destination}
						</button>
					</li>
				))}
			</ul>

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
						<button onClick={() => setRouteIndex(index)}>
							{route.summary}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

const GoogleMaps = Skinnable(GoogleMapsBase);

export default GoogleMaps;
export {
	GoogleMaps,
	GoogleMapsBase
};
