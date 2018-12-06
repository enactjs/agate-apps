// Service Connection HOC
//
// External
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React from 'react';
import compose from 'ramda/src/compose';
import {equals} from 'ramda';
import PropTypes from 'prop-types';

// Data Services
import {propTypeLatLon, propTypeLatLonList} from './proptypes';
import connect from './connector';
import {getLatLongFromSim, radiansToDegrees} from './conversion';
import appConfig from '../App/configLoader';
import Communicator from '../../../components/Communicator';

import AppStateConnect from '../App/AppContextConnect';


const ServiceLayerBase = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'ServiceLayer';

		static propTypes = {
			setConnected: PropTypes.func.isRequired,
			setLocation: PropTypes.func.isRequired,
			updateDestination: PropTypes.func.isRequired,
			autonomous: PropTypes.bool,
			destination: propTypeLatLonList,
			location: propTypeLatLon,
			navigating: PropTypes.bool,
			navigation: PropTypes.object
		}

		constructor (props) {
			super(props);

			this.done = false;
			this.comm = React.createRef();

			// this.state = {
			// 	showAppList: false
			// };

			// const tickler = setInterval(this.doTickle, 1000);
		}

		componentDidMount () {
			this.initializeConnection();
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

			if (
				// navigating changed to FALSE
				prevProps.navigating !== this.props.navigating && !this.props.navigating
			) {
				this.stopNavigation();
			}

			if (prevProps.navigation.duration !== this.props.navigation.duration) {
				this.sendNavigation();
			}
		}

		initializeConnection () {
			if (!this.connection) {
				console.log('Connecting to', appConfig.servicesLayerHost);
				this.connection = connect({
					url: 'ws://' + appConfig.servicesLayerHost,
					onConnection: () => {
						console.log('%cConnected to Service Layer', 'color: green');
						if (this.reconnectLater) this.reconnectLater.stop();
						this.props.setConnected(true);
					},
					onClose: () => {
						console.log('%cDisconnected from Service Layer', 'color: red');

						this.initiateAutomaticReconnect();

						// Activate a reconnect button
						this.props.setConnected(false);
					},
					onError: message => {
						Error(':( Service Error', message);

						this.initiateAutomaticReconnect();

						// Activate a reconnect button
						this.props.setConnected(false);
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
		}

		reconnect = () => {
			console.warn('%cAttempting to reconnect with the service layer at:', 'color: orange', appConfig.servicesLayerHost);
			this.connection.reconnect();
		}

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
			const destination = this.props.destination;
			const {x, y} = message.pose.position;
			const location = this.normalizePositionData(message.pose);

			if (!this.done && destination) {
				let vx = message.pose.linear_velocity.x;
				let vy = message.pose.linear_velocity.y;
				if (
					Math.sqrt(
						(x - destination.x) * (x - destination.x) +
						(y - destination.y) * (y - destination.y)
					) < 5 &&
					Math.sqrt(vx * vx + vy * vy) < 0.1
				) {

					this.done = true;
					console.log('Destination Reached:', location, 'Automatic driving mode now disabled.');
				}
			}
			this.props.setLocation({location});
		}

		onRoutingRequest = (message) => {
			if (message.broadcast && message.header && message.header.status && message.header.status.error_code === 0) {
				// Just a normal request received response. Don't bother to do anything.
			} else {
				console.log('%conRoutingRequest:', 'color: orange', message);
			}
		}

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
				this.props.updateDestination({destination, navigating: true});
			}
		}

		//
		// General Event Handling
		//

		setDestination = () => {
			const {autonomous, destination, location, navigating} = this.props;

			// console.log('Checking for whether to start navigating.', Boolean(navigating), Boolean(destination && destination.slice(-1).lat !== 0));
			if (autonomous && navigating && destination && destination.slice(-1).lat !== 0) {
				console.log('%cSending routing request:', 'color: magenta', [location, ...destination]);
				this.connection.send('routingRequest', [location, ...destination]);
			}
		}

		stopNavigation = () => {
			console.log('%cStopping Navigation', 'color: magenta');
			// Trick the simulator into stopping by telling it to navigate to where it already is.
			this.connection.send('routingRequest', [this.props.location, this.props.location]);
		}

		sendNavigation = () => {
			this.comm.current.sendETA(this.props.navigation);
		}

		setConnected = (connected) => {
			this.props.updateAppState((state) => {
				if (state.connections.serviceLayer === connected) return null;
				state.connections.serviceLayer = connected;
			});
		}

		sendVideo = (args) => {
			this.comm.current.sendVideo(args);
		}

		resetPosition = (coordinates) => {
			this.connection.send('positionReset', coordinates);
		}

		sendNavigation = () => {
			// console.log('sendNavigation:', this.props.navigation);
			this.comm.current.sendETA(this.props.navigation);
		}

		render () {
			const {...rest} = this.props;
			delete rest.setLocation;
			delete rest.setConnected;
			delete rest.updateDestination;
			delete rest.location;
			delete rest.navigation;
			delete rest.setConnected;
			delete rest.setLocation;
			delete rest.updateDestination;

			return (
				<React.Fragment>
					<Communicator ref={this.comm} host={appConfig.communicationServerHost} />
					<Wrapped
						{...rest}
						sendVideo={this.sendVideo}
						resetPosition={this.resetPosition}
					/>
				</React.Fragment>
			);
		}
	};
});

const ServiceLayer = compose(
	AppStateConnect(({location: locationProp, navigation, updateAppState}) => ({
		autonomous: navigation.autonomous,
		destination: navigation.destination,
		location: locationProp,
		navigation,
		navigating: navigation.navigating,
		// tickleCount: tickleCountProp,
		// setTickle: ({tickleCount}) => {
		// 	updateAppState((state) => {
		// 		state.tickleCount = tickleCount;
		// 	});
		// },
		setConnected: (connected) => {
			updateAppState((state) => {
				if (state.connections.serviceLayer === connected) return null;
				state.connections.serviceLayer = connected;
			});
		},
		setLocation: ({location}) => {
			updateAppState((state) => {
				// console.log('Setting location app state:', location);
				state.location = location;
			});
		},
		updateDestination: ({destination, navigating}) => {
			updateAppState((state) => {
				state.navigation.destination = destination;
				if (navigating != null) {
					state.navigation.navigating = navigating;
				}
			});
		}
		// endNavigation: ({navigating}) => {
		// 	updateAppState((state) => {
		// 		state.navigation.navigating = navigating;
		// 	});
		// }
	})),
	ServiceLayerBase
);

export default ServiceLayer;
export {
	ServiceLayer
};
