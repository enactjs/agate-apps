import {adaptEvent, forward, handle} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React from 'react';
import openSocket from 'socket.io-client';

const handleAddVideo = handle(
	adaptEvent(item => ({url: item.url}), forward('onPlayVideo'))
);

const handleShowAd = handle(
	forward('onShowAd')
);

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

	constructor () {
		super();

		handleAddVideo.bindAs(this, 'handleAddVideo');
		handleShowAd.bindAs(this, 'handleShowAd');
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

		if (screenId != null) {
			this.socket.on(`VIDEO_ADD_SCREEN/${screenId}`, this.handleAddVideo);
			this.socket.on('SHOW_AD', this.handleShowAd);
			this.socket.on('SHOW_ETA', this.handleShowETA);
		}
	}

	_disconnect (screenId) {
		if (this.socket) {
			if (screenId != null) {
				this.socket.removeAllListeners(`VIDEO_ADD_SCREEN/${screenId}`);
			}

			this.socket.close();
		}
	}

	connect = () => this._connect(this.props.screenId);

	disconnect = () => this._disconnect(this.props.screenId);

	sendVideo = ({screenId, video}) => {
		const data = {
			type: 'youtube',
			title: video.snippet.title,
			url: `https://www.youtube.com/embed/${video.id}?autoplay=1`,
			route: `VIDEO_ADD_SCREEN/${screenId}`
		};

		this.socket.emit('SEND_DATA', data);
		this.socket.emit('VIDEO_SENT', {id: this.props.screenId});
	};

	sendETA = ({eta, duration}) => {
		const data = {
			route: 'SHOW_ETA',
			eta,
			duration
		};
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
