import openSocket from 'socket.io-client';
import React from 'react';

class API extends React.Component {

	shouldComponentUpdate () {
		return false;
	}

	connect = ({onPlayVideo, onShowAdSpace}) => {
		const {screenId} = this.props;

		this.socket = openSocket('http://localhost:3000');

		if (screenId !== 'console') {
			this.listenForVideoChange({onPlayVideo});
			this.socket.on('SHOW_AD', onShowAdSpace);
			this.socket.emit('COPILOT_CONNECT', {id: screenId});
		}
	};

	disconnect = () => {
		if (this.socket) {
			this.socket.removeAllListeners(`VIDEO_ADD_COPILOT/${this.props.screenId}`);
			this.socket.close();
		}
	};

	listenForVideoChange = ({onPlayVideo}) => {
		this.socket.on(`VIDEO_ADD_COPILOT/${this.props.screenId}`, (item) => {
			onPlayVideo({url: item.url});
		});
	};

	sendVideoData = ({screenId, video}) => {
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
export {API};
