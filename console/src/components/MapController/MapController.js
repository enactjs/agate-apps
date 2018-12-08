import React from 'react';
import PropTypes from 'prop-types';
import {equals} from 'ramda';
import hoc from '@enact/core/hoc';
import Pure from '@enact/ui/internal/Pure';
// import classnames from 'classnames';
// import Slottable from '@enact/ui/Slottable';
import Group from '@enact/ui/Group';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import ToggleButton from '@enact/agate/ToggleButton';

import AppContextConnect from '../../App/AppContextConnect';
import MapCore from '../MapCore';
import DestinationList from '../DestinationList';
import {propTypeLatLon, propTypeLatLonList} from '../../data/proptypes';
import {formatDuration, formatTime} from '../../../../components/Formatter';

import css from './MapController.less';

const MapControllerHoc = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MapControllerHoc';

		static propTypes = {
			topLocations: PropTypes.array.isRequired,
			updateDestination: PropTypes.func.isRequired,
			centeringDuration: PropTypes.number,
			defaultFollow: PropTypes.bool, // Should the centering position follow the current location?
			destination: propTypeLatLonList,
			position: propTypeLatLon, // The map's centering position
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

			const destinationIndex = this.findDestinationInList(props);

			this.state = {
				carShowing: true,
				follow: props.defaultFollow || false,
				selfDriving: true,
				destinationIndex
			};
		}

		findDestinationInList = (props) => {
			const {destination, topLocations} = props || this.props;
			let matchingDestIndex;

			// console.log('findDestinationInList:', {topLocations, destination});
			topLocations.forEach((loc, index) => {
				// console.log('comparing:', [loc.coordinates], 'and', destination);
				if (equals([loc.coordinates], destination)) {
					// console.log('MATCH!', index);
					matchingDestIndex = index;
				}
			});
			return matchingDestIndex;
		}

		handleSetDestination = ({selected}) => {
			console.log('proposing new destination index:', selected, this.props.topLocations[selected]);
			// this.props.updateProposedDestination(this.props.topLocations[selected]);
			const loc = this.props.topLocations[selected];
			this.props.updateDestination({
				description: loc ? loc.description : '',
				destination: loc ? [loc.coordinates] : null,
				navigating: false
			});
			this.setState({destinationIndex: selected});
		}

		startNavigation = ({selected}) => {
			// console.log('navigating', selected);
			console.log(selected ? ('start navigation to', this.props.topLocations, this.props.topLocations[this.state.destinationIndex], this.state.destinationIndex) : 'stopping navigation');
			if (selected) {
				const loc = this.props.topLocations[this.state.destinationIndex];
				this.props.updateDestination({
					description: loc.description,
					destination: [loc.coordinates],
					navigating: true
				});
			} else {
				this.props.updateDestination({
					destination: null,
					navigating: false
				});
			}
		}

		// toggleSelfDriving = () => {
		// 	this.props.toggleSelfDriving();
		// }

		render () {
			const {topLocations, destination, selfDrivingSelection, locationSelection, compact, navigation, noStartStopToggle, toggleSelfDriving, updateDestination, ...rest} = this.props;
			delete rest.centeringDuration;
			// delete rest.destination;
			delete rest.defaultFollow;
			delete rest.position;
			// delete rest.updateDestination;
			// delete rest.toggleSelfDriving;
			delete rest.updateProposedDestination;
			delete rest.viewLockoutDuration;
			delete rest.zoomToSpeedScaleFactor;
			const durationIncrements = ['day', 'hour', 'min'];

			const destIndex = this.findDestinationInList();

			// console.log('destinationIndex:', this.state.destinationIndex, 'destIndex:', destIndex, 'navigation.navigating:', navigation.navigating);
			// console.log('MapController destination:', destination);

			// let destination;
			// if (topLocations && this.state.destinationIndex) {
			// 	destination = [topLocations[this.state.destinationIndex].coordinates];
			// 	// console.log('controller destination:', destination);
			// }

			return (
				<Wrapped
					{...rest}
					// className={classnames(className, css.map)}
					// onSetDestination={this.handleSetDestination}
					// destination={navigation.destination && navigation.destination.coordinates}
					destination={destination}
					points={topLocations}
					updateDestination={updateDestination}
				>
					<tools>
						<Column className={css.toolsColumn}>
							{
								selfDrivingSelection &&
								<Cell shrink>
									<Divider>Self Driving</Divider>
									<Row
										component={Group}
										childComponent={Button}
										onSelect={toggleSelfDriving}
										select="radio"
										selectedProp="highlighted"
										selected={navigation.autonomous ? 0 : 1}
									>
										{['AUTO', 'MANUAL']}
									</Row>
								</Cell>
							}
							{
								locationSelection &&
								<Cell>
									<DestinationList
										onSetDestination={this.handleSetDestination}
										positions={topLocations}
										title="Top Locations"
										selected={destIndex}
									/>
								</Cell>
							}
							{
								compact && destination &&
								<Cell shrink>
									<Button
										className={css.button}
										small
										highlighted
										disabled
									>{destination.description}</Button>
								</Cell>
							}
							{
								destination &&
								<Cell shrink>
									<p>{formatDuration(navigation.duration, durationIncrements)}</p>
									<p>{(navigation.distance / 1609.344).toFixed(1)} mi - {formatTime(navigation.eta)}</p>
								</Cell>
							}
							{
								!noStartStopToggle &&
								<Cell shrink>
									<ToggleButton
										className={css.button}
										small
										selected={destination && navigation.navigating}
										onToggle={this.startNavigation}
										toggleOnLabel="Stop Navigation"
										toggleOffLabel="Start Navigation"
									/>
								</Cell>
							}
						</Column>
					</tools>
				</Wrapped>
			);
		}
	};
});

// const CompactMapBrains = hoc((configHoc, Wrapped) => {
// 	const positions = [
// 		{lat: 37.788818, lon: -122.404568}, // LG office
// 		{lat: 37.791356, lon: -122.400823}, // Blue Bottle Coffee
// 		{lat: 37.788988, lon: -122.401076},
// 		{lat: 37.7908574786, lon: -122.399391029},
// 		{lat: 37.786116, lon: -122.402140}
// 	];

// 	return class extends React.Component {
// 		static displayName = 'CompactMapBrains';
// 		constructor (props) {
// 			super(props);
// 			this.state = {
// 				positionIndex: 0,
// 				destination: null
// 			};
// 		}

// 		handleSetDestination = () => {
// 			// Take our current position and assign it as our internal (local to this HOC) destination
// 			this.setState(({positionIndex}) => ({destination: [positions[positionIndex]]}));
// 		}

// 		changePosition = () => {
// 			this.setState(({positionIndex}) => ({
// 				// go to the next position in the list
// 				positionIndex: ((positionIndex + 1) % positions.length)
// 			}));
// 		}

// 		render () {
// 			return (
// 				<Wrapped
// 					{...this.props}
// 					changePosition={this.changePosition}
// 					follow={this.state.follow}
// 					onSetDestination={this.handleSetDestination}
// 					destination={this.state.destination}
// 					destination={[positions[this.state.positionIndex]]}
// 				/>
// 			);
// 		}
// 	};
// });


const ConnectedMap = AppContextConnect(({location, userSettings, navigation, updateAppState}) => {
	// if (!(navigation.destination instanceof Array)) debugger;
	return {
	// We should import the app-level variable for our current location then feed that in as the "start"
		topLocations: userSettings.topLocations,
		location,
		navigation,
		destination: navigation.destination,
		toggleSelfDriving: () => {
			updateAppState((state) => {
				state.navigation.autonomous = !state.navigation.autonomous;
			});
		},
		// updateProposedDestination: (destination) => {
		// 	updateAppState((state) => {
		// 		state.navigation.destination = destination;
		// 	});
		// },
		updateDestination: ({description, destination, navigating = false}) => {
			updateAppState((state) => {
				// console.log('updateDestination:', destination, navigating);
				if (typeof destination !== 'undefined') {
					state.navigation.description = description;
					state.navigation.destination = destination;
				}
				if (navigating != null) {
					state.navigation.navigating = navigating;
				}
			});
		}
	};
});

const MapController = ConnectedMap(Pure(MapControllerHoc(MapCore)));

export default MapController;
