// Service Connection HOC
//
// External
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React from 'react';
import compose from 'ramda/src/compose';
// import PropTypes from 'prop-types';

// Data Services
import connect from './connector';
import appConfig from '../../config';

import AppStateConnect from '../App/AppContextConnect';


const ServiceLayerBase = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'ServiceLayer';

		constructor (props) {
			super(props);
			// this.state = {
			// 	index: props.defaultIndex || 0,
			// 	showPopup: false,
			// 	showBasicPopup: false,
			// 	showDateTimePopup: false,
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
						this.setState({
							connected: true
						});
					},
					onClose: () => {
						console.log('%cDisconnected from Service Layer', 'color: red');

						this.initiateAutomaticReconnect();

						// Activate a reconnect button
						this.setState({
							connected: false
						});
					},
					onError: message => {
						Error(':( Service Error', message);

						this.initiateAutomaticReconnect();

						// Activate a reconnect button
						this.setState({
							connected: false
						});
					},
					onRoutingRequest: this.onRoutingRequest
					// onJoystick: this.onJoystick,
					// onInfrared: this.onInfrared,
					// onObstacle: this.onObstacle,
					// onUltrasound: this.onUltrasound,
					// onWheelsCmd: this.onWheelsCmd
				});
				// this.debugReadout = setInterval(this.updateDebugReadout, this.debugReadoutInterval);
			}
		}

		initiateAutomaticReconnect = () => {
			if (this.reconnectLater) this.reconnectLater.stop();
			this.reconnectLater = new Job(this.reconnect, 1000);
			this.reconnectLater.start();
		}

		reconnect = () => {
			console.warn('%cAttempting to reconnect with the service layer at:', 'color: orange', appConfig.servicesLayerHost);
			this.connection.ros.connect('ws://' + appConfig.servicesLayerHost);
		}

		//
		// Topic Handling Methods
		//

		onRoutingRequest = (message) => {
			console.log('%cSaw "%s" with %d\% certanty.', 'color: orange', message.label, parseInt(message.score * 100));
			// if (this.jobDetected) {
			// 	this.jobDetected.stop();
			// }

			const [label] = message.label.split(','); // Just use the first tagged thing in the onscreen message, for simplicity

			const state = {
				active: true,
				label,
				activeImageSrc: this.state.imageSrc,
				...this.visionIntepretation(message.label)
			};
			this.setState(state);

			// this.jobDetected = new Job(() => {
			// 	this.setState({active: false});
			// }, this.props.activeTimeout);
			// this.jobDetected.start();
		}


		//
		// General Event Handling
		//

		render () {
			const {...rest} = this.props;
			// delete rest.setTickle;

			return (
				<Wrapped
					{...rest}
					// destination={this.state.destination}
					// navigating={false}
				/>
			);
		}
	};
});

const ServiceLayer = compose(
	AppStateConnect(({destination: destinationProp, updateAppState}) => ({
		destination: destinationProp,
		// tickleCount: tickleCountProp,
		// setTickle: ({tickleCount}) => {
		// 	updateAppState((state) => {
		// 		state.tickleCount = tickleCount;
		// 	});
		// },
		setDestination: ({destination, navigating}) => {
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
