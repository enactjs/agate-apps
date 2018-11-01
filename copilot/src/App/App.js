import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Row} from '@enact/ui/Layout';
import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import React from 'react';

import API from '../../../components/API';

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
					noAutoDismiss
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
			popupOpen: true,
			screenId: 1,
			showAd: this.props.showAd || false,
			url: ''
		};
		// reference for the API component
		this.API = React.createRef();
		// Job to control hiding ads
		this.adTimer = new Job(this.hideAdSpace);
	}

	componentWillUnmount () {
		this.API.current.disconnect();
		this.adTimer.stop();
	}

	onToggle = () => {
		this.setState(({popupOpen}) => {
			return {popupOpen: !popupOpen};
		});
	};

	// Note for this one we may need to include some logic to actually switch channels.
	// for example if we're on screen 2, but we want to tune into screen 1 we can just switch.
	setScreen = (screenId) => () => {
		// disconnect any current connections
		this.API.current.disconnect();
		// set the new screen ID
		this.setState({screenId}, () => {
			// connect
			this.API.current.connect({onPlayVideo: this.playVideo, onShowAdSpace: this.showAdSpace});
		});

		// close the popup
		this.onToggle();
	};

	hideAdSpace = () => {
		this.setState({adContent: '', showAd: false});
	};

	playVideo = ({url}) => {
		this.setState({url});
	};

	showAdSpace = ({adContent, duration}) => {
		this.setState({adContent, showAd: true});
		this.adTimer.startAfter(duration);
	};

	render () {
		const {adContent, popupOpen, showAd, url} = this.state;
		const props = {
			adContent,
			popupOpen,
			showAd,
			url
		};

		return (
			<React.Fragment>
				{/* eslint-disable-next-line */}
				<API screenId={this.state.screenId} ref={this.API} />
				<AppBase {...props} togglePopup={this.onToggle} setScreen={this.setScreen} />
			</React.Fragment>
		);
	}
}

export default AgateDecorator(App);
