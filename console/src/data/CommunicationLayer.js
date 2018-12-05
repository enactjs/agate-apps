import React from 'react';
import Communicator from '../../../components/Communicator';
import appConfig from '../App/configLoader';
export const CommunicationLayer = (Wrapped) => {
	return class Communication extends React.Component {
		constructor (props) {
			super(props);
			this.comm = React.createRef();
		}
		sendVideo = (args) => {
			this.comm.current.sendVideo(args);
		};
		resetPosition = (coordinates) => {
			this.connection.send('positionReset', coordinates);
		};
		render () {
			return (<React.Fragment>
				<Communicator ref={this.comm} host={appConfig.communicationServerHost} />
				<Wrapped {...this.props} sendVideo={this.sendVideo} resetPosition={this.resetPosition} />
			</React.Fragment>);
		}
	};
};
