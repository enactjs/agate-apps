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

class API extends React.Component {

	static propTypes = {
		noAutoConnect: PropTypes.boolean,
		screenId: PropTypes.number
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

	handleAddVideo = handleAddVideo.bind(this)

	handleShowAd = handleShowAd.bind(this)

	_connect (screenId) {
		this.socket = openSocket('http://localhost:3000');

		if (screenId != null) {
			this.socket.on(`VIDEO_ADD_COPILOT/${screenId}`, );
			this.socket.on('SHOW_AD', handleShowAd.bind(this));
			this.socket.emit('COPILOT_CONNECT', {id: screenId});
		}
	}

	_disconnect (screenId) {
		if (this.socket) {
			if (screenId != null) {
				this.socket.removeAllListeners(`VIDEO_ADD_COPILOT/${screenId}`);
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
			route: `VIDEO_ADD_COPILOT/${screenId}`
		};

		this.socket.emit('SEND_DATA', data);
	};

	render () {
		return null;
	}
}

export default API;
export {
	API
};
