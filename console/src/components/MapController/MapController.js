import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import {equals} from 'ramda';
import {Job} from '@enact/core/util';
import Slottable from '@enact/ui/Slottable';
import Group from '@enact/ui/Group';
import {Cell, Column} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import Button from '@enact/agate/Button';
import ToggleButton from '@enact/agate/ToggleButton';

import AppContextConnect from '../../App/AppContextConnect';
import MapCore from '../MapCore';
import DestinationList from '../DestinationList';
import {propTypeLatLon, propTypeLatLonList} from '../../data/proptypes';
import {formatDuration, formatTime} from '../../../../components/Formatter';

import css from './MapController.less';

class MapControllerBase extends React.Component {
	static propTypes = {
		setDestination: PropTypes.func.isRequired,
		updateNavigation: PropTypes.func.isRequired,
		centeringDuration: PropTypes.number,
		defaultFollow: PropTypes.bool, // Should the centering position follow the current location?
		destination:propTypeLatLonList,
		location: propTypeLatLon, // Our actual current location on the world
		position: propTypeLatLon, // The map's centering position
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
			follow: props.defaultFollow || false,
			selfDriving: true
		};
	}

	componentWillMount () {
	}

	handleSetDestination = ({selected}) => {
		this.props.updateProposedDestination(this.props.topLocations[selected]);
	}

    startNavigation = () => {
    	console.log('start navigation to', this.props.topLocations[this.state.destinationIndex], this.state.destinationIndex);
    	this.props.setDestination({destination: this.props.topLocations[this.state.destinationIndex]});
    }

	toggleSelfDriving = () => {
		this.props.toggleSelfDriving();
	}

	render () {
		const {className, location, topLocations, selfDrivingSelection, locationSelection, compact, navigation, noStartStopToggle, proposedDestination, ...rest} = this.props;
		delete rest.centeringDuration;
		delete rest.destination;
		delete rest.defaultFollow;
		delete rest.position;
		delete rest.setDestination;
		delete rest.skin;
		delete rest.updateNavigation;
		delete rest.viewLockoutDuration;
		delete rest.zoomToSpeedScaleFactor;
		const durationIncrements = ['day', 'hour', 'min'];
		const {selfDriving, destination} = this.state;

		return (
			<div {...rest} className={classnames(className, css.map)}>
				<MapCore
					destination={destination}
					onSetDestination={this.handleSetDestination}
					location={location}
				>
					<tools>
						{
							selfDrivingSelection && <Cell>
								<Button onClick={this.toggleSelfDriving} highlighted={selfDriving} small>AUTO</Button>
								<Button onClick={this.toggleSelfDriving} highlighted={!selfDriving} small>MANUAL</Button>
							</Cell>
						}
						{
							locationSelection && <Cell>
								<DestinationList
									onSetDestination={this.handleSetDestination}
									positions={topLocations}
									title="Top Locations"
								/>
							</Cell>
						}
						{
							compact && proposedDestination && <Button
								className={css.button}
								small
								highlighted
								disabled
							>{proposedDestination.description}</Button>
						}
						{
							proposedDestination &&
							<Cell>
								<p>{formatDuration(navigation.duration, durationIncrements)}</p>
								<p>{(navigation.distance / 1609.344).toFixed(1)} mi - {formatTime(navigation.eta)}</p>
							</Cell>
						}
						{
							!noStartStopToggle && <ToggleButton
								className={css.button}
								small
								selected={navigation.navigating}
								onClick={this.startNavigation}
								toggleOnLabel="Stop Navigation"
								toggleOffLabel="Start Navigation"
							/>
						}
					</tools>
				</MapCore>
			</div>
		);
	}
}

const ConnectedMap = AppContextConnect(({location, userSettings, navigation, updateAppState}) => ({
	// We should import the app-level variable for our current location then feed that in as the "start"
	skin: userSettings.skin,
	topLocations: userSettings.topLocations,
	location,
	navigation,
	colorAccent: userSettings.colorAccent,
	toggleSelfDriving: () => {
		updateAppState((state) => {
			state.navigation.auto = !state.navigation.auto;
		});
	},
	updateProposedDestination: (proposedDestination) => {
		updateAppState((state) => {
			state.navigation.proposedDestination = proposedDestination;
		});
	},
	setDestination: ({destination}) => {
		updateAppState((state) => {
			state.navigation.destination = destination.coordinates;
		});
	},
	updateNavigation: ({duration, eta, startTime, distance}) => {
		updateAppState((state) => {
			state.navigation.duration = duration;
			state.navigation.startTime = startTime;
			state.navigation.eta = eta;
			state.navigation.distance = distance;
			// console.log('updateNavigation:', state.navigation);
		});
	}
}));

const MapController = ConnectedMap(Slottable(MapControllerBase));

export default MapController;
