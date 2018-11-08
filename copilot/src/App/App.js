import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Row} from '@enact/ui/Layout';
import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import PropTypes from 'prop-types';
import React from 'react';

import appConfig from '../../config';
import Communicator from '../../../components/Communicator';

import css from './App.less';

const zeroPad = (val) => (val < 10 ? '0' + val : val);
const formatTime = (time) => {
	const formattedEta = new Date(time);
	let hour = formattedEta.getHours() % 12 || 12,
		min = zeroPad(formattedEta.getMinutes()),
		// sec = zeroPad(formattedEta.getSeconds()),
		ampm = (formattedEta.getHours() >= 13 ? 'pm' : 'am');
	return `${hour}:${min} ${ampm}`;
};
const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app enact-fit'
	},

	render: ({adContent, showAd, url, popupOpen, setScreen, togglePopup, eta, duration, ...rest}) => {
		return (
			<React.Fragment>
				{eta && <Row>
					<Cell>{parseInt(duration / 60)} min</Cell>
					<Cell>{formatTime(eta)}</Cell>
				</Row>}
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
			</React.Fragment>
		);
	}
});

class App extends React.Component {

	static propTypes = {
		adContent: PropTypes.string,
		showAd: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.state = {
			adContent: this.props.adContent || 'Your Ad Here',
			popupOpen: true,
			screenId: 1,
			showAd: this.props.showAd || false,
			url: ''
		};
		// Job to control hiding ads
		this.adTimer = new Job(this.hideAdSpace);
	}

	componentWillUnmount () {
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
		// set the new screen ID
		this.setState({screenId});

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

	showETA = ({eta, duration}) => {
		this.setState({eta, duration});
		this.adTimer.startAfter(duration);
	}

	render () {
		const {adContent, popupOpen, showAd, url, eta, duration} = this.state;
		const props = {
			adContent,
			popupOpen,
			showAd,
			url,
			eta,
			duration
		};

		return (
			<React.Fragment>
				<Communicator
					host={appConfig.communacitonServerHost}
					screenId={this.state.screenId}
					onPlayVideo={this.playVideo}
					onShowAd={this.showAdSpace}
					onShowETA={this.showETA}
				/>
				<AppBase {...props} togglePopup={this.onToggle} setScreen={this.setScreen} />
			</React.Fragment>
		);
	}
}

export default AgateDecorator(App);
