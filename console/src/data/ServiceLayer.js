// Service Connection HOC
//
// External
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React from 'react';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';

// Data Services
import connect from './connector';
import {getLatLongFromSim} from './conversion';
import appConfig from '../../config';
import Communicator from '../../../components/Communicator';

import AppStateConnect from '../App/AppContextConnect';


const ServiceLayerBase = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'ServiceLayer';

		static propTypes = {
			requestDestination: PropTypes.func.isRequired,
			setConnected: PropTypes.func.isRequired,
			setLocation: PropTypes.func.isRequired,
			destination: PropTypes.object,
			location: PropTypes.object
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
					onRoutingRequest: this.onRoutingRequest
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

			location.orientation =  Math.round(data.heading * 10000) / 10000;

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


		//
		// General Event Handling
		//

		setDestination = ({destination}) => {
			this.props.requestDestination({destination, navigating: true});
			// console.log('location:', this.props.location, 'destination', destination);
			this.connection.send('routingRequest', [this.props.location, destination]);
		}

		sendVideo = (args) => {
			this.comm.current.sendVideo(args);
		}

		sendETA = (args) => {
			this.comm.current.sendETA(args);
		}

		render () {
			const {...rest} = this.props;
			delete rest.setLocation;
			delete rest.setConnected;
			delete rest.requestDestination;
			delete rest.location;
			delete rest.destination;
			// delete rest.setTickle;

			return (
				<React.Fragment>
					<Communicator ref={this.comm} host={appConfig.communacitonServerHost} />
					<Wrapped
						{...rest}
						setDestination={this.setDestination}
						sendVideo={this.sendVideo}
						sendETA={this.sendETA}
						// location={this.state.location}
						// destination={this.state.destination}
						// navigating={false}
					/>
				</React.Fragment>
			);
		}
	};
});

const ServiceLayer = compose(
	AppStateConnect(({destination: destinationProp, location: locationProp, navigation, updateAppState}) => ({
		location: locationProp,
		destination: destinationProp,
		eta: navigation.eta,
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
		requestDestination: ({destination, navigating}) => {
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
