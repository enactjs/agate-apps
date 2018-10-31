import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Row} from '@enact/ui/Layout';
import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import openSocket from 'socket.io-client';
import Popup from '@enact/agate/Popup';
import React from 'react';

import css from './App.less';

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app enact-fit'
	},

	render: ({adContent, showAd, url, popupOpen, setScreen, togglePopup, ...rest}) => {
		return (
			<div {...rest}>
				<Popup
					open={popupOpen}
					closeButton
					onClose={togglePopup}
				>
					<title>
					Select Your Screen Source
					</title>
					<buttons>
						<Button onClick={setScreen(1)}>Screen 1</Button>
						<Button onClick={setScreen(2)}>Screen 2</Button>
					</buttons>
				</Popup>
				<Row {...rest}>
					<Cell
						className={css.iframe}
						allow="autoplay"
						component="iframe"
						src={url}
					/>
					{!showAd ? null : <Cell className={css.adSpace} shrink>
						{adContent}
					</Cell>}
				</Row>
				<Button style={{position: 'absolute'}} icon="plug" onClick={togglePopup} />
			</div>
		);
	}
});

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			adContent: this.props.adContent || 'Your Ad Here',
			url: '',
			popupOpen: true,
			showAd: this.props.showAd || false,
			screenId: 1
		};
		// Job to control hiding ads
		this.adTimer = new Job(this.hideAdSpace);
	}

	componentWillMount () {
		this.socket = openSocket('http://localhost:3000');
		this.listenForVideoChange(this.state.screenId);
		this.socket.on('SHOW_AD', this.showAdSpace);
		this.socket.emit('COPILOT_CONNECT', this.state.screenId);
	}

	componentDidUpdate (prevProps, prevState) {
		if (prevState.screenId !== this.state.screenId) {
			this.socket.removeAllListeners(`VIDEO_ADD_COPILOT/${prevState.screenId}`);
			this.listenForVideoChange(this.state.screenId);
		}
	}

	componentWillUnmount () {
		this.socket.close();
		this.adTimer.stop();
	}

	listenForVideoChange = (screenId) => {
		this.socket.on(`VIDEO_ADD_COPILOT/${screenId}`, (item) => {
			this.setState(() => {
				return {
					url: item.url
				};
			});
		});
	}

	onToggle = () => {
		this.setState(({popupOpen}) => {
			return {popupOpen: !popupOpen};
		});
	}

	// Note for this one we may need to include some logic to actually switch channels.
	// for example if we're on screen 2, but we want to tune into screen 1 we can just switch.
	setScreen = (screenId) => () => {
		this.setState(() => {
			return {screenId: screenId};
		});
		this.onToggle();
	}


	hideAdSpace = () => {
		this.setState({adContent: '', showAd: false});
	};

	showAdSpace = ({adContent, duration}) => {
		this.setState({adContent, showAd: true});
		this.adTimer.startAfter(duration);
	};

	render () {
		const props = {...this.state};
		delete props.screenId;

		return (
			<AppBase {...props} togglePopup={this.onToggle} setScreen={this.setScreen} />
		);
	}
}

export default AgateDecorator(App);
