import {adaptEvent, forward, handle} from '@enact/core/handle';
import PropTypes from 'prop-types';
import {Component} from 'react';
import openSocket from 'socket.io-client';

const handleChangeSkinSettings = handle(
	forward('onChangeSkinSettings')
);

const handleAddVideo = handle(
	adaptEvent(item => ({url: item.url}), forward('onPlayVideo'))
);

// const handleShowAd = handle(
// 	forward('onShowAd')
// );

const handleShowETA = handle(
	forward('onShowETA')
);

class Communicator extends Component {

	static propTypes = {
		enableFakeTime: PropTypes.func,
		fakeTimeHost: PropTypes.string,
		host: PropTypes.string,
		noAutoConnect: PropTypes.bool,
		onReload: PropTypes.func,
		onReset: PropTypes.func,
		screenId: PropTypes.number
	};

	static defaultProps = {
		fakeTimeHost: 'localhost:3002',
		host: 'localhost:3000'
	};

	constructor (props) {
		super(props);

		handleChangeSkinSettings.bindAs(this, 'handleChangeSkinSettings');
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
		let fakeTimeSocket = openSocket(`ws://${this.props.fakeTimeHost}`);
		if (this.props.onReset) {
			this.socket.on('RESET_COPILOT', this.props.onReset);
		}

		if (this.props.onReload) {
			this.socket.on('RELOAD_APP', this.props.onReload);
		}

		if (this.props.enableFakeTime) {
			fakeTimeSocket.on('FAKE_TIME', this.props.enableFakeTime);
		}

		this.socket.on(`SKIN_SETTINGS`, this.handleChangeSkinSettings);

		if (screenId != null) {
			this.socket.on(`VIDEO_ADD_SCREEN/${screenId}`, this.handleAddVideo);
			// this.socket.on('SHOW_AD', this.handleShowAd);
			this.socket.on('SHOW_ETA', this.handleShowETA);
			console.log('Connected to', this.props.host, 'and listening for events:', 'SHOW_ETA', `VIDEO_ADD_SCREEN/${screenId}`); // eslint-disable-line no-console
		}
	}

	_disconnect (screenId) {
		if (this.socket) {
			if (screenId != null) {
				this.socket.removeAllListeners('SKIN_SETTINGS');
				this.socket.removeAllListeners('SHOW_ETA');
				this.socket.removeAllListeners(`VIDEO_ADD_SCREEN/${screenId}`);
			}

			this.socket.close();
		}
	}

	connect = () => this._connect(this.props.screenId);

	disconnect = () => this._disconnect(this.props.screenId);

	sendETA = ({eta, duration}) => {
		const data = {
			route: 'SHOW_ETA',
			eta,
			duration
		};
		console.log('sendETA to', this.props.host, ['SEND_DATA:', data]); // eslint-disable-line no-console
		this.socket.emit('SEND_DATA', data);
	};

	sendSkinSettings = (skinSettings) => {
		const data = {
			route: 'SKIN_SETTINGS',
			skinSettings
		};
		this.socket.emit('SEND_DATA', data);
	};

	sendVideo = ({screenId, video}) => {
		const data = {
			route: `VIDEO_ADD_SCREEN/${screenId}`,
			type: 'youtube',
			title: video.snippet.title,
			url: `https://www.youtube.com/embed/${video.id}?autoplay=1`
		};

		console.log('Sending to', this.props.host, ['SEND_DATA:', data, 'Sending VIDEO_SENT:', {id: screenId}]); // eslint-disable-line no-console
		this.socket.emit('SEND_DATA', data);
		this.socket.emit('VIDEO_SENT', {id: screenId});
	};

	resetCopilot = () => {
		const data = {route: 'RESET_COPILOT'};
		this.socket.emit('SEND_DATA', data);
	};

	reloadApp = () => {
		const data = {route: 'RELOAD_APP'};
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
