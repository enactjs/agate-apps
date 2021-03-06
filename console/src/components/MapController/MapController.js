import React from 'react';
import PropTypes from 'prop-types';
import hoc from '@enact/core/hoc';
import Pure from '@enact/ui/internal/Pure';
import classnames from 'classnames';
import Group from '@enact/ui/Group';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import IconButton from '@enact/agate/IconButton';
import ToggleButton from '@enact/agate/ToggleButton';
import Skinnable from '@enact/agate/Skinnable';

import AppContextConnect from '../../App/AppContextConnect';
import MapCore from '../MapCore';
import DestinationList from '../DestinationList';
import {propTypeLatLon, propTypeLatLonList} from '../../data/proptypes';
import {formatDuration, formatTime} from '../../../../components/Formatter';

import css from './MapController.module.less';

const StyledButton = ({style = {}, ...rest}) => {
	style.width = 'auto';  // Allow the buttons to properly self-size. Margins + auto-sizing confuses relatively positioned elements with 0 width and flex.
	return <Button {...rest} style={style} css={css} />;
};

const MapControllerHoc = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MapControllerHoc';

		static propTypes = {
			topLocations: PropTypes.array.isRequired,
			updateAppState: PropTypes.func.isRequired,
			autonomousSelection: PropTypes.bool,
			centeringDuration: PropTypes.number,
			compact: PropTypes.bool,
			description: PropTypes.string,
			destination: propTypeLatLonList,
			follow: PropTypes.bool,
			locationSelection: PropTypes.bool,
			navigating: PropTypes.bool,
			navigation: PropTypes.object,
			noStartStopToggle: PropTypes.bool,
			position: propTypeLatLon, // The map's centering position
			tools: PropTypes.node, // Buttons and tools for interacting with the map. (Slottable)
			viewLockoutDuration: PropTypes.number,
			zoomToSpeedScaleFactor: PropTypes.number
		}

		static defaultProps = {
			centeringDuration: 2000,
			follow: true,
			viewLockoutDuration: 4000,
			zoomToSpeedScaleFactor: 0.02
		}

		constructor (props) {
			super(props);

			this.state = {
				carShowing: true,
				selfDriving: true
			};
		}

		handleSetDestination = ({selected}) => {
			console.log('Proposing new destination index:', selected, '->', this.props.topLocations[selected]);
			const loc = this.props.topLocations[selected];
			this.updateDestination({
				description: loc ? loc.description : '',
				destination: loc ? [loc.coordinates] : null
			});
		}

		startNavigation = ({selected}) => {
			if (selected) {
				console.log('MapController - start navigation to', this.props.topLocations, this.props.topLocations[this.state.destinationIndex], 'from index:', this.state.destinationIndex);
				this.updateDestination({
					navigating: true
				});
			} else {
				console.log('MapController - stopping navigation');
				this.updateDestination({
					destination: null,
					navigating: false
				});
			}
		}

		toggleAutonomous = () => {
			this.props.updateAppState((state) => {
				state.navigation.autonomous = !state.navigation.autonomous;
			});
		}
		toggleFollow = () => {
			this.props.updateAppState((state) => {
				state.navigation.follow = !state.navigation.follow;
			});
		}
		updateDestination = ({description, destination, navigating = false}) => {
			this.props.updateAppState((state) => {
				if (typeof destination !== 'undefined') {
					state.navigation.description = description;
					state.navigation.destination = destination;
				}
				if (navigating != null) {
					state.navigation.navigating = navigating;
				}
			});
		}
		updateNavigation = ({duration, distance}) => {
			this.props.updateAppState((state) => {
				const startTime = new Date().getTime();
				const eta = new Date(startTime + (duration * 1000)).getTime();

				state.navigation.duration = duration;
				state.navigation.startTime = startTime;
				state.navigation.eta = eta;
				state.navigation.distance = distance;
			});
		}

		onExpand = () => {
			if (this.props.onExpand) {
				this.props.onExpand({view: 'map'});
			}
		}

		render () {
			const {
				autonomousSelection,
				className,
				destination,
				follow,
				locationSelection,
				navigating,
				navigation,
				noExpandButton,
				noFollowButton,
				noStartStopToggle,
				topLocations,
				...rest
			} = this.props;

			delete rest.centeringDuration;
			delete rest.onExpand;
			delete rest.position;
			delete rest.updateAppState;
			delete rest.updateProposedDestination;
			delete rest.viewLockoutDuration;
			delete rest.zoomToSpeedScaleFactor;
			const durationIncrements = ['day', 'hour', 'min'];

			return (
				<Wrapped
					{...rest}
					className={classnames(className, css.map)}
					follow={follow}
					destination={destination}
					points={topLocations}
					updateDestination={this.updateDestination}
					updateNavigation={this.updateNavigation}
				>
					<tools>
						<Column className={css.toolsColumn}>
							<Cell align="end" shrink>
								{
									noFollowButton ?
										null :
										<IconButton
											size="smallest"
											alt="Follow Mode"
											selected={follow}
											onClick={this.toggleFollow}
										>
											compass
										</IconButton>
								}
								{
									noExpandButton ?
										null :
										<IconButton
											size="smallest"
											alt="Fullscreen"
											onClick={this.onExpand}
										>
											expand
										</IconButton>
								}
							</Cell>
							{
								autonomousSelection && !(destination && navigating) ?
									<Cell shrink={locationSelection} className={css.columnCell}>
										<Divider spacing="medium" className={css.heading}>Self-driving</Divider>
										<Row
											component={Group}
											childComponent={Cell}
											itemProps={{component: StyledButton}}
											onSelect={this.toggleAutonomous}
											select="radio"
											selectedProp="selected"
											selected={navigation.autonomous ? 0 : 1}
										>
											{['AUTO', 'MANUAL']}
										</Row>
									</Cell> : null
							}
							{
								locationSelection && !(destination && navigating) ?
									<Cell className={css.columnCell}>
										<DestinationList
											destination={destination}
											onSetDestination={this.handleSetDestination}
											positions={topLocations}
											title="Top Locations"
										/>
									</Cell> :
									<Cell className={css.columnCell} />
							}
							{/* {
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
							}*/}
							{
								destination &&
								<Cell shrink className={css.columnCell + ' ' + css.travelInfo}>
									<p>
										{formatDuration(navigation.duration, durationIncrements).split(' ').map(
											// This bit of overly-complicated nonsense is to separate
											// out the duration into numbers (wrapped in span tags)
											// and strings. The initial string is split on spaces and
											// spaces are added around the strings rather than the
											// strings and the numbers, so the numbers can be a
											// larger font size and the spacing around them will
											// remain constant. The format of the string coming in
											// is always "number string number string", etc, so the
											// spaces only on the strings should be acceptable.
											(str, index) =>
												(isNaN(parseInt(str)) ?
													' ' + str + ' ' :
													<span className={css.number} key={'number' + index}>{str}</span>
												)
										)}
									</p>
									<p>{(navigation.distance / 1609.344).toFixed(1)} mi - {formatTime(navigation.eta)}</p>
								</Cell>
							}
							{
								!noStartStopToggle && destination &&
								<Cell
									shrink
									className={css.columnCell}
									component={ToggleButton}
									css={css}
									small
									// We want to be able to factor in the autonomous state, but
									// perhaps that needs to happen in ServiceLayer, and not here.
									selected={destination && navigating}
									onToggle={this.startNavigation}
									toggleOnLabel="Stop Navigation"
									toggleOffLabel="Start Navigation"
								/>
							}
						</Column>
					</tools>
				</Wrapped>
			);
		}
	};
});


const ConnectedMap = AppContextConnect(({location, userSettings, navigation, updateAppState}) => ({
	follow: navigation.follow,
	topLocations: userSettings.topLocations,
	location,
	navigation,
	navigating: navigation.navigating,
	destination: navigation.destination,
	updateAppState
}));

const MapController = ConnectedMap(Pure(MapControllerHoc(Skinnable(MapCore))));

export default MapController;
