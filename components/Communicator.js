import {adaptEvent, forward, handle} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React from 'react';
import openSocket from 'socket.io-client';

const handleAddVideo = handle(
	adaptEvent(item => ({url: item.url}), forward('onPlayVideo'))
);

// const handleShowAd = handle(
// 	forward('onShowAd')
// );

const handleShowETA = handle(
	forward('onShowETA'),
);

class Communicator extends React.Component {

	static propTypes = {
		host: PropTypes.string,
		noAutoConnect: PropTypes.bool,
		screenId: PropTypes.number
	};

	static defaultProps = {
		host: 'localhost:3000'
	};

	constructor (props) {
		super(props);

		handleAddVideo.bindAs(this, 'handleAddVideo');
		// handleShowAd.bindAs(this, 'handleShowAd');
		handleShowETA.bindAs(this, 'handleShowETA');
	}

	componentDidMount () {
		if (!this.props.noAutoConnect) {
			this.connect();
		}
	}

	componentDidUpdate (prevProps) {
		if (!this.props.noAutoConnect && prevProps.screenId !== this.props.screenId) {
			this._disconnect(prevProps.screenId);
			this.connect();
		}
	}

	componentWillUnmount () {
		this.disconnect();
	}

	_connect (screenId) {
		this.socket = openSocket(`ws://${this.props.host}`);
		if (this.props.onReset) {
			this.socket.on('RESET_COPILOT', this.props.onReset);
		}

		if (this.props.onReload) {
			this.socket.on('RELOAD_APP', this.props.onReload);
		}

		if (screenId != null) {
			this.socket.on(`VIDEO_ADD_SCREEN/${screenId}`, this.handleAddVideo);
			// this.socket.on('SHOW_AD', this.handleShowAd);
			this.socket.on('SHOW_ETA', this.handleShowETA);
			console.log('Connected to', this.props.host, 'and listening for events:', `VIDEO_ADD_SCREEN/${screenId}`, 'SHOW_ETA');
		}
	}

	_disconnect (screenId) {
		if (this.socket) {
			if (screenId != null) {
				this.socket.removeAllListeners(`VIDEO_ADD_SCREEN/${screenId}`);
				this.socket.removeAllListeners('SHOW_ETA');
			}

			this.socket.close();
		}
	}

	connect = () => this._connect(this.props.screenId);

	disconnect = () => this._disconnect(this.props.screenId);

	sendVideo = ({screenId, video}) => {
		const data = {
			route: `VIDEO_ADD_SCREEN/${screenId}`,
			type: video.kind,
			title: video.snippet.title,
			url: video.kind === 'sony#video' ? video.url : `https://www.youtube.com/embed/${video.id}?autoplay=1`
		};

		console.log('Sending to', this.props.host, ['SEND_DATA:', data, 'Sending VIDEO_SENT:', {id: screenId}]);
		this.socket.emit('SEND_DATA', data);
		this.socket.emit('VIDEO_SENT', {id: screenId});
	};

	resetCopilot = () => {
		const data = {route: 'RESET_COPILOT'};
		this.socket.emit('SEND_DATA', data);
	}

	reloadApp = () => {
		const data = {route: 'RELOAD_APP'};
		this.socket.emit('SEND_DATA', data);
	}

	sendETA = ({eta, duration}) => {
		const data = {
			route: 'SHOW_ETA',
			eta,
			duration
		};
		console.log('sendETA to', this.props.host, ['SEND_DATA:', data]);
		this.socket.emit('SEND_DATA', data);
	};

	render () {
		return null;
	}
}

export default Communicator;
export {
	Communicator
};
