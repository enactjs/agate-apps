// Service Connection HOC
//
// External
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React from 'react';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';

// Data Services
import {propTypeLatLon, propTypeLatLonList} from './proptypes';
import connect from './connector';
import {getLatLongFromSim, radiansToDegrees} from './conversion';
import appConfig from '../../config';
import Communicator from '../../../components/Communicator';

import AppStateConnect from '../App/AppContextConnect';


const ServiceLayerBase = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'ServiceLayer';

		static propTypes = {
			setConnected: PropTypes.func.isRequired,
			setLocation: PropTypes.func.isRequired,
			updateDestination: PropTypes.func.isRequired,
			destination: propTypeLatLonList,
			location: propTypeLatLon,
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

		// doTickle = () => {
		// 	// this.setState(({tickleCount}) => ({tickleCount: tickleCount + 1}));
		// 	if (this.props.setTickle) {
		// 		console.log('running doTickle');
		// 		const tickleCount = this.props.tickle;
		// 		this.props.setTickle({tickleCount: tickleCount + 1});
		// 	}
		// }

		componentDidMount () {
			this.initializeConnection();
		}

		componentDidUpdate (prevProps) {
			if (prevProps.navigation && this.props.navigation &&
				prevProps.navigation.destination && this.props.navigation.destination && (
					prevProps.navigation.destination.lat !== this.props.navigation.destination.lat ||
					prevProps.navigation.destination.lon !== this.props.navigation.destination.lon
				)
			) {
				this.setDestination();
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

			location.orientation =  radiansToDegrees(Math.round(data.heading * 10000) / 10000);

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
			this.setDestination({destination});
		}

		//
		// General Event Handling
		//

		setDestination = ({destination}) => {
			const {navigation, location} = this.props;
			destination = destination || navigation.destination; // Accept external args, in case the request came from within this component, but fallback to the navigation prop (the preferred usage).
			this.props.updateDestination({destination, navigating: true});
			// console.log('location, dest(s):', [location, ...destination]);
			this.connection.send('routingRequest', [location, ...destination]);
		}

		sendVideo = (args) => {
			this.comm.current.sendVideo(args);
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
			// delete rest.setTickle;

			return (
				<React.Fragment>
					<Communicator ref={this.comm} host={appConfig.communacitonServerHost} />
					<Wrapped
						{...rest}
						sendVideo={this.sendVideo}
					/>
				</React.Fragment>
			);
		}
	};
});

const ServiceLayer = compose(
	AppStateConnect(({location: locationProp, navigation, updateAppState}) => ({
		location: locationProp,
		navigation,
		// tickleCount: tickleCountProp,
		// setTickle: ({tickleCount}) => {
		// 	updateAppState((state) => {
		// 		state.tickleCount = tickleCount;
		// 	});
		// },
		setConnected: (connected) => {
			updateAppState((state) => {
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
