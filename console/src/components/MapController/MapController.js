import React from 'react';
import PropTypes from 'prop-types';
import hoc from '@enact/core/hoc';
import Pure from '@enact/ui/internal/Pure';
// import classnames from 'classnames';
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
			updateNavigation: PropTypes.func.isRequired,
			autonomousSelection: PropTypes.bool,
			centeringDuration: PropTypes.number,
			compact: PropTypes.bool,
			defaultFollow: PropTypes.bool, // Should the centering position follow the current location?
			description: PropTypes.string,
			destination: propTypeLatLonList,
			locationSelection: PropTypes.bool,
			navigating: PropTypes.bool,
			navigation: PropTypes.object,
			noStartStopToggle: PropTypes.bool,
			position: propTypeLatLon, // The map's centering position
			toggleAutonomous: PropTypes.func,
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

			this.state = {
				carShowing: true,
				follow: props.defaultFollow || false,
				selfDriving: true
			};
		}

		handleSetDestination = ({selected}) => {
			console.log('Proposing new destination index:', selected, '->', this.props.topLocations[selected]);
			const loc = this.props.topLocations[selected];
			this.props.updateDestination({
				description: loc ? loc.description : '',
				destination: loc ? [loc.coordinates] : null
			});
		}

		startNavigation = ({selected}) => {
			if (selected) {
				console.log('MapController - start navigation to', this.props.topLocations, this.props.topLocations[this.state.destinationIndex], 'from index:', this.state.destinationIndex);
				this.props.updateDestination({
					navigating: true
				});
			} else {
				console.log('MapController - stopping navigation');
				this.props.updateDestination({
					destination: null,
					navigating: false
				});
			}
		}

		render () {
			const {
				compact,
				description,
				destination,
				locationSelection,
				navigating,
				navigation,
				noStartStopToggle,
				autonomousSelection,
				toggleAutonomous,
				topLocations,
				updateDestination,
				updateNavigation,
				...rest
			} = this.props;

			delete rest.centeringDuration;
			delete rest.defaultFollow;
			delete rest.position;
			delete rest.updateProposedDestination;
			delete rest.viewLockoutDuration;
			delete rest.zoomToSpeedScaleFactor;
			const durationIncrements = ['day', 'hour', 'min'];

			return (
				<Wrapped
					{...rest}
					// className={classnames(className, css.map)}
					destination={destination}
					points={topLocations}
					updateDestination={updateDestination}
					updateNavigation={updateNavigation}
				>
					<tools>
						<Column className={css.toolsColumn}>
							{
								autonomousSelection &&
								<Cell shrink={locationSelection} className={css.columnCell}>
									<Divider>Self Driving</Divider>
									<Row
										component={Group}
										childComponent={Button}
										onSelect={toggleAutonomous}
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
								<Cell className={css.columnCell}>
									<DestinationList
										destination={destination}
										onSetDestination={this.handleSetDestination}
										positions={topLocations}
										title="Top Locations"
									/>
								</Cell>
							}
							{
								compact && destination && description &&
								<Cell shrink className={css.columnCell}>
									<Divider>Navigating To</Divider>
									<Button
										className={css.button}
										small
										highlighted
										disabled
									>{description}</Button>
								</Cell>
							}
							{
								destination &&
								<Cell shrink className={css.columnCell}>
									<p>{formatDuration(navigation.duration, durationIncrements)}</p>
									<p>{(navigation.distance / 1609.344).toFixed(1)} mi - {formatTime(navigation.eta)}</p>
								</Cell>
							}
							{
								!noStartStopToggle && destination &&
								<Cell shrink className={css.columnCell}>
									<ToggleButton
										className={css.button}
										small
										// We want to be able to factor in the autonomous state, but
										// perhaps that needs to happen in ServiceLayer, and not here.
										selected={destination && navigating}
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


const ConnectedMap = AppContextConnect(({location, userSettings, navigation, updateAppState}) => ({
	topLocations: userSettings.topLocations,
	location,
	navigation,
	navigating: navigation.navigating,
	description: navigation.description,
	destination: navigation.destination,
	toggleAutonomous: () => {
		updateAppState((state) => {
			state.navigation.autonomous = !state.navigation.autonomous;
		});
	},
	updateDestination: ({description, destination, navigating = false}) => {
		updateAppState((state) => {
			if (typeof destination !== 'undefined') {
				state.navigation.description = description;
				state.navigation.destination = destination;
			}
			if (navigating != null) {
				state.navigation.navigating = navigating;
			}
		});
	},
	updateNavigation: ({duration, distance}) => {
		updateAppState((state) => {
			const startTime = new Date().getTime();
			const eta = new Date(startTime + (duration * 1000)).getTime();

			state.navigation.duration = duration;
			state.navigation.startTime = startTime;
			state.navigation.eta = eta;
			state.navigation.distance = distance;
		});
	}
}));

const MapController = ConnectedMap(Pure(MapControllerHoc(MapCore)));

export default MapController;
