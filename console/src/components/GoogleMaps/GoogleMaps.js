/* global google*/
/* eslint-disable react/jsx-no-bind, no-shadow */

import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Cell, Column} from '@enact/ui/Layout';
import Skinnable from "@enact/ui/Skinnable";
import {APIProvider, Map, Marker, useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

import appConfig from '../../App/configLoader';
import DestinationList from '../DestinationList';

import css from './GoogleMaps.module.less';

if (!appConfig.googleMapsApiKey) {
	Error('Please set `googleMapsApiKey` key in your `config.js` file to your own Google Maps API key.');
}

const position = {lat: 37.78878, lng: -122.40467};

// const DestinationButton = (props) => {
// 	const {children, 'data-index': index, ...rest} = props;
// 	return <Button size="small" {...rest} css={css}>
// 		<Marker css={css}>{index + 1}</Marker>
// 		{children}
// 	</Button>;
// };

const GoogleMapsBase = kind({
	name: 'GoogleMaps',

	propTypes: {
		noExpandButton: PropTypes.bool,
		onExpand: PropTypes.func
	},

	styles: {
		css,
		className: 'googleMaps'
	},

	render: ({noExpandButton, onExpand}) => {
		return (
			<>
				<APIProvider apiKey={appConfig.googleMapsApiKey}>
					<Map
						center={position}
						fullscreenControl={false}
						zoom={8}
					>
						<Marker position={position} />
						<Directions noExpandButton={noExpandButton} onExpand={onExpand} />
					</Map>
				</APIProvider>
			</>
		);
	}
});


const destinations = [
		{
			"description": "Home",
			"coordinates": '37.78877, -122.39647'
		},
		{
			"description": "Philz Coffee",
			"coordinates": '37.78895, -122.3931'
		},
		{
			"description": "School",
			"coordinates": '37.793424, -122.401124'
		},
		{
			"description": "Work",
			"coordinates": '37.783902, -122.396148'
		},
		{
			"description": "MOMA",
			"coordinates": '37.785684, -122.401035'
		}
];

function Directions ({noExpandButton, onExpand}) {
	const map = useMap();
	const routesLibrary = useMapsLibrary("routes");
	const [directionsService, setDirectionsService] = useState();
	const [directionsRenderer, setDirectionsRenderer] = useState();
	const [routes, setRoutes] = useState([]);
	const [routeIndex, setRouteIndex] = useState(0);
	const selected = routes[routeIndex];
	const leg = selected?.legs[0];
	const [selectedDestination, setSelectedDestination] = useState(destinations[0]);

	useEffect(() => {
		if (!routesLibrary || !map) return;
		setDirectionsService(new routesLibrary.DirectionsService());
		setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
	}, [routesLibrary, map]);

	useEffect(() => {
		if (!directionsRenderer || !directionsService) return;

		directionsService.route({
			origin: '37.78878, -122.40467',
			destination: selectedDestination.coordinates,
			travelMode: google.maps.TravelMode.DRIVING,
			provideRouteAlternatives: true
		})
			.then((response) => {
				directionsRenderer.setDirections(response);
				setRoutes(response.routes);
			});

	}, [directionsService, directionsRenderer, selectedDestination]);

	// Update direction route
	useEffect(() => {
		if (!directionsRenderer) return;
		directionsRenderer.setRouteIndex(routeIndex);
	}, [routeIndex, directionsRenderer, selectedDestination]);

	if (!leg) return null;

	const onExpandFunc = () => {
		console.log("test", onExpand, noExpandButton);
		if (onExpand) {
			onExpand({view: 'map'});
		}
	};

	return (
		<div>
			<Column className={css.toolsColumn}>
			<Cell align="end" shrink>
				{
					noExpandButton ?
						null :
						<Button
							size="small"
							alt="Fullscreen"
							onClick={onExpandFunc}
							icon="expand"
						/>
				}
			</Cell>
			</Column>
			<div className={css.directions}>
				<h4>Choose destination</h4>
				<ul>
					{destinations.map((destination) => (
						<li key={destination.description}>
							<button onClick={() => setSelectedDestination(destination.coordinates)}>
								{destination.description}
							</button>
						</li>
					))}
				</ul>

				{/*<Cell className={css.columnCell}>*/}
				{/*	<DestinationList*/}
				{/*		destination={selectedDestination}*/}
				{/*		onSetDestination={this.handleSetDestination}*/}
				{/*		//positions={topLocations}*/}
				{/*		//title="Top Locations"*/}
				{/*	/>*/}
				{/*</Cell>*/}

				<h4>Selected route: {selected.summary}</h4>
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
		</div>
	);
}

const GoogleMaps = Skinnable(GoogleMapsBase);

export default GoogleMaps;
export {
	GoogleMaps,
	GoogleMapsBase
};
