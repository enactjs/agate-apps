import Button from '@enact/agate/Button';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import Skinnable from '@enact/agate/Skinnable';

import MapCore from '../components/MapCore';

const MapBase = kind({
	name: 'Map',

	// styles: {
	// 	css,
	// 	className: 'map'
	// },

	render: ({changePosition, onSetDestination, ...rest}) => {
		return (
			<MapCore {...rest}>
				<tools>
					<Button alt="POI search" icon="search" />
					<Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
					<Button alt="Navigate here" icon="play" onClick={onSetDestination} />
				</tools>
			</MapCore>
		);
	}
});

const MapBrains = hoc((configHoc, Wrapped) => {
	const positions = [
		{lat: 37.788818, lon: -122.404568}, // LG office
		{lat: 37.791356, lon: -122.400823}, // Blue Bottle Coffee
		{lat: 37.788988, lon: -122.401076},
		{lat: 37.7908574786, lon: -122.399391029},
		{lat: 37.786116, lon: -122.402140}
	];

	return class extends React.Component {
		static displayName = 'CompactMapBrains';
		constructor (props) {
			super(props);
			this.state = {
				positionIndex: 0,
				destination: null
			};
		}

		handleSetDestination = () => {
			// Take our current position and assign it as our internal (local to this HOC) destination
			this.setState(({positionIndex}) => ({destination: [positions[positionIndex]]}));
		}

		changePosition = () => {
			this.setState(({positionIndex}) => ({
				// go to the next position in the list
				positionIndex: ((positionIndex + 1) % positions.length)
			}));
		}

		render () {
			return (
				<Wrapped
					{...this.props}
					changePosition={this.changePosition}
					follow={this.state.follow}
					onSetDestination={this.handleSetDestination}
					destination={this.state.destination}
					proposedDestination={[positions[this.state.positionIndex]]}
				/>
			);
		}
	};
});

const MapView = Skinnable(MapBrains(MapBase));

export default MapView;
export {MapView as Map};
