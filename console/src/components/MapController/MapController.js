import React from 'react';
import PropTypes from 'prop-types';
import {equals} from 'ramda';
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
			centeringDuration: PropTypes.number,
			defaultFollow: PropTypes.bool, // Should the centering position follow the current location?
			description: PropTypes.string,
			destination: propTypeLatLonList,
			navigating: PropTypes.bool,
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
			console.log(selected ? ['start navigation to', this.props.topLocations, this.props.topLocations[this.state.destinationIndex], this.state.destinationIndex] : 'stopping navigation');
			if (selected) {
				const loc = this.props.topLocations[this.state.destinationIndex];
				if (loc && loc.coordinates) {
					this.props.updateDestination({
						description: loc.description,
						destination: [loc.coordinates],
						navigating: true
					});
				}
			} else {
				this.props.updateDestination({
					destination: null,
					navigating: false
				});
			}
		}

		render () {
			const {topLocations, destination, description, navigating, selfDrivingSelection, locationSelection, compact, navigation, noStartStopToggle, toggleSelfDriving, updateDestination, ...rest} = this.props;
			delete rest.centeringDuration;
			delete rest.defaultFollow;
			delete rest.position;
			delete rest.updateProposedDestination;
			delete rest.viewLockoutDuration;
			delete rest.zoomToSpeedScaleFactor;
			const durationIncrements = ['day', 'hour', 'min'];

			const destIndex = this.findDestinationInList();

			return (
				<Wrapped
					{...rest}
					// className={classnames(className, css.map)}
					destination={destination}
					points={topLocations}
					updateDestination={updateDestination}
				>
					<tools>
						<Column className={css.toolsColumn}>
							{
								selfDrivingSelection &&
								<Cell shrink className={css.columnCell}>
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
								<Cell className={css.columnCell}>
									<DestinationList
										onSetDestination={this.handleSetDestination}
										positions={topLocations}
										title="Top Locations"
										selected={destIndex}
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
								!noStartStopToggle &&
								<Cell shrink className={css.columnCell}>
									<ToggleButton
										className={css.button}
										small
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
	// We should import the app-level variable for our current location then feed that in as the "start"
	topLocations: userSettings.topLocations,
	location,
	navigation,
	navigating: navigation.navigating,
	description: navigation.description,
	destination: navigation.destination,
	toggleSelfDriving: () => {
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
	}

}));

const MapController = ConnectedMap(Pure(MapControllerHoc(MapCore)));

export default MapController;
