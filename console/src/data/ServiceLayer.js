// Service Connection HOC
//
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import {equals} from 'ramda';
import compose from 'ramda/src/compose';
import {Component, createContext, createRef, Fragment, memo} from 'react';

import AppStateConnect from '../App/AppContextConnect';
import appConfig from '../App/configLoader';
import Communicator from '../../../components/Communicator';

import connect from './connector';
import {getLatLongFromSim, radiansToDegrees, distanceApart} from './conversion';
import {propTypeLatLon, propTypeLatLonList} from './proptypes';

const ServiceLayerContext = createContext();

const ServiceLayerBase = hoc((configHoc, Wrapped) => {
	const PureWrapped = memo(Wrapped);
	return class extends Component {
		static displayName = 'ServiceLayer';

		static propTypes = {
			updateAppState: PropTypes.func.isRequired,
			autonomous: PropTypes.bool,
			destination: propTypeLatLonList,
			follow: PropTypes.bool,
			location: propTypeLatLon,
			navigating: PropTypes.bool,
			navigation: PropTypes.object
		};

		constructor (props) {
			super(props);

			this.comm = createRef();
			this.maps = new Set();
			this.location = this.props.location;
			this.isFirstPosition = true;
			this.destinationReached = false;
		}

		state = {
			fakeTimeEnabled: false
		}

		componentDidMount () {
			this.initializeConnection();
			// this.generateFakeLocations(); // Fake locations generator (for testing only)
			this.appStateSyncInterval = global.setInterval(() => {
				this.setLocation({location: this.location});
			}, 5000);
		}

		componentDidUpdate (prevProps) {
			if (
				// destination changed
				!equals(prevProps.destination, this.props.destination) ||
				// navigating changed to TRUE
				prevProps.navigating !== this.props.navigating && this.props.navigating
			) {
				this.setDestination();
			}

			//
			// Temporarily disabling the navigation FALSE code due to it being unreliable.
			// We'll need to look into this a bit more soon.
			//
			// if (
			// 	// navigating changed to FALSE
			// 	prevProps.navigating !== this.props.navigating && !this.props.navigating
			// ) {
			// 	this.stopNavigation();
			// }

			if (prevProps.navigation.duration !== this.props.navigation.duration) {
				this.sendNavigation();
			}
		}

		componentWillUnmount () {
			global.clearInterval(this.appStateSyncInterval);
		}

		initializeConnection () {
			if (!this.connection) {
				console.log('Connecting to', appConfig.servicesLayerHost); // eslint-disable-line no-console
				this.connection = connect({
					url: 'ws://' + appConfig.servicesLayerHost,
					onConnection: () => {
						console.log('%cConnected to Service Layer', 'color: green'); // eslint-disable-line no-console
						if (this.reconnectLater) this.reconnectLater.stop();
						this.setConnected(true);
					},
					onClose: () => {
						console.log('%cDisconnected from Service Layer', 'color: red'); // eslint-disable-line no-console

						this.initiateAutomaticReconnect();

						// Activate a reconnect button
						this.setConnected(false);
					},
					onError: message => {
						Error(':( Service Error', message);

						this.initiateAutomaticReconnect();

						// Activate a reconnect button
						this.setConnected(false);
					},
					onPosition: this.onPosition,
					onRoutingRequest: this.onRoutingRequest,
					onRoutingResponse: this.onRoutingResponse
				});
			}
		}

		initiateAutomaticReconnect = () => {
			if (this.reconnectLater) this.reconnectLater.stop();
			this.reconnectLater = new Job(this.reconnect, 1000);
			this.reconnectLater.start();
		};

		reconnect = () => {
			console.warn('%cAttempting to reconnect with the service layer at:', 'color: orange', appConfig.servicesLayerHost); // eslint-disable-line no-console
			this.connection.reconnect();
		};

		// The following two functions generate location coordinates to aid in testing when the
		// simulator is not available.
		generateFakeLocations = () => {
			this.fakePositionIndex = 0;
			this.fakePositionJob = setInterval(() => {
				this.onPosition(this.fabricatePosition(this.fakePositionIndex));
				this.fakePositionIndex++;
			}, 1000);
			console.log('Starting fake position generation'); // eslint-disable-line no-console
		};

		fabricatePosition = (seed, maxSeed = 60) => {
			const seedFactor = 4,
				x = 53880.8698406219 + 499000, // Unknown as to why the reset coordinates needed an extra 499000 added.
				y = 4182781.1160838,
				z = -2.3562;
			seed = seed % maxSeed;
			return {
				pose: {
					position: {x: x + (seed * seedFactor), y: y + (seed * seedFactor), z},
					heading: 0.7625,
					linear_velocity: {x: 0, y: 0, z: 0} // eslint-disable-line
				}
			};
		};

		// `data` takes the shape of message.pose
		normalizePositionData (data) {
			const {x, y} = data.position;
			const location = getLatLongFromSim(x, y);

			// convert heading to degrees, invert it, add 90deg (to make 0 "north"),
			// and keep the orientation between 0 and 360)
			location.orientation = (360 + radiansToDegrees(Math.round(data.heading * -10000) / 10000) + 90) % 360;

			// Velocity is in meters per second - math optimized for speed
			location.linearVelocity = Math.round((
				Math.sqrt(
					data.linear_velocity.x * data.linear_velocity.x +
					data.linear_velocity.y * data.linear_velocity.y +
					data.linear_velocity.z * data.linear_velocity.z
				)
			) * 10000) / 10000;
			return location;
		}

		//
		// Topic Handling Methods
		//

		onPosition = (message) => {
			// console.log('%conPosition', 'color: orange', message.pose);
			const {destination} = this.props;
			const location = this.normalizePositionData(message.pose);
			const lastDestinationWaypoint = destination && destination.slice(-1)[0];
			const metersFromDestination = distanceApart(location, lastDestinationWaypoint);
			const metersFromLastLocation = distanceApart(location, this.props.location);

			// We're traveling at a slow 1m/s and we're less than 10 meters from our destination.
			// We don't care, in this situation, if we're autonomously driving or not.
			if (location.linearVelocity < 1 &&
				metersFromDestination != null &&
				metersFromDestination < 10 &&
				!this.destinationReached
			) {
				console.log('Destination Reached'); // eslint-disable-line no-console
				this.arriveAtDestination();
			}

			this.location = location;
			if (this.isFirstPosition) {
				this.setLocation({location});
				this.isFirstPosition = false;
			}

			// If the location is more than 0.01 meters apart, go ahead and update the location.
			if (this.maps.size > 0 && metersFromLastLocation > 0.01) {
				for (let map of this.maps) {
					if (map.actionManager) {
						const actions = {
							positionCar: location
						};
						if (this.props.follow) {
							actions.center = location;
						}
						map.actionManager(actions);
					}
				}
			}
		};

		onRoutingRequest = (message) => {
			if (message.broadcast && message.header && message.header.status && message.header.status.error_code === 0) {
				// Just a normal request received response. Don't bother to do anything.
			} else {
				console.log('%conRoutingRequest:', 'color: orange', message); // eslint-disable-line no-console
			}
		};

		onRoutingResponse = (message) => {
			// We may be able to load multiple previous waypoints here, if more than one was sent
			const {x, y} = message.routing_request.waypoint.slice(-1).pop().pose;
			const destination = [getLatLongFromSim(x, y)];
			// this.setDestination({destination, navigating: true});
			// Save this new destination, and trigger a re-render, which will be caught in the
			// "prop changed" pipeline and handled by setDestination below. Also, set navigating to
			// true, since this change comes directly from the simulator, and the only way to get a
			// destination from the simulator is if it's already "navigating".
			if (!equals(destination, this.props.destination)) {
				this.updateDestination({destination, navigating: true});
			}
		};

		//
		// General Event Handling
		//

		setDestination = () => {
			const {autonomous, destination, location, navigating} = this.props;

			this.destinationReached = false; // New destination means the popup is available again.
			// console.log('Checking for whether to start navigating.', Boolean(navigating), Boolean(destination && destination.slice(-1).lat !== 0));
			if (autonomous && navigating && destination && destination.slice(-1).lat !== 0) {
				console.log('%cSending routing request:', 'color: magenta', [location, ...destination]); // eslint-disable-line no-console
				if (this.connection) {
					this.connection.send('routingRequest', [location, ...destination]);
				}
			}
		};

		stopNavigation = () => {
			console.log('%cStopping Navigation', 'color: magenta'); // eslint-disable-line no-console
			// Trick the simulator into stopping by telling it to navigate to where it already is.
			this.connection.send('routingRequest', [this.props.location, this.props.location]);
		};

		sendNavigation = () => {
			this.comm.current.sendETA(this.props.navigation);
		};

		setConnected = (connected) => {
			this.props.updateAppState((state) => {
				if (state.connections.serviceLayer === connected) return null;
				state.connections.serviceLayer = connected;
			});
		};

		sendSkinSettings = (skin) => {
			this.comm.current.sendSkinSettings(skin);
		};

		sendVideo = (args) => {
			const {screenId, video: {snippet: {thumbnails}}} = args;
			this.props.updateAppState((state) => {
				state.multimedia.nowPlaying[screenId] = thumbnails;
			});
			this.comm.current.sendVideo(args);
		};

		resetPosition = (coordinates) => {
			this.connection.send('positionReset', coordinates);
		};

		resetCopilot = () => {
			this.comm.current.resetCopilot();
		};

		reloadApp = () => {
			this.comm.current.reloadApp();
		};

		handleReload = () => {
			global.location.reload();
		};



		setLocation = ({location}) => {
			this.props.updateAppState((state) => {
				if (distanceApart(state.location, location) > 0) {
					state.location = location;
				}
			});
		};

		updateDestination = ({destination, navigating}) => {
			this.props.updateAppState((state) => {
				state.navigation.destination = destination;
				if (navigating != null) {
					state.navigation.navigating = navigating;
				}
			});
		};

		arriveAtDestination = () => {
			if (!this.destinationReached) {
				this.destinationReached = true; // Only allow one popup per destination.
				this.props.updateAppState((state) => {
					state.appState.showDestinationReachedPopup = true;
					state.navigation.navigating = false;
				});
			}
		};

		getMap = (map) => {
			this.maps.add(map);
		};

		onMapUnmount = (map) => {
			this.maps.delete(map);
		};

		enableFakeTime = (enabled) => {
			this.setState({fakeTimeEnabled: enabled});
		};

		render () {
			const {...rest} = this.props;
			delete rest.autonomous;
			delete rest.destination;
			delete rest.follow;
			delete rest.location;
			delete rest.navigating;
			delete rest.navigation;
			delete rest.updateAppState;

			return (
				<Fragment>
					<ServiceLayerContext.Provider value={{getMap: this.getMap, onMapUnmount: this.onMapUnmount}}>
						<Communicator
							fakeTimeHost={appConfig.fakeTimeServerHost}
							host={appConfig.communicationServerHost}
							onReload={this.handleReload}
							enableFakeTime={this.enableFakeTime}
							ref={this.comm}
						/>
						<PureWrapped
							{...rest}
							reloadApp={this.reloadApp}
							resetCopilot={this.resetCopilot}
							resetPosition={this.resetPosition}
							sendSkinSettings={this.sendSkinSettings}
							sendVideo={this.sendVideo}
							fakeTimeEnabled={this.state.fakeTimeEnabled}
						/>
					</ServiceLayerContext.Provider>
				</Fragment>
			);
		}
	};
});

const ServiceLayer = compose(
	AppStateConnect(({location: locationProp, navigation, updateAppState}) => ({
		autonomous: navigation.autonomous,
		destination: navigation.destination,
		follow: navigation.follow,
		location: locationProp,
		navigation,
		navigating: navigation.navigating,
		updateAppState
	})),
	ServiceLayerBase
);

export default ServiceLayer;
export {
	ServiceLayer,
	ServiceLayerContext
};
