import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import LabeledItem from '@enact/agate/LabeledItem';
import Popup from '@enact/agate/Popup';
import PropTypes from 'prop-types';
import React from 'react';

import appConfig from '../../config';
import Communicator from '../../../components/Communicator';
import NetworkInfo from '../../../components/NetworkInfo';

import css from './App.less';

const zeroPad = (val) => (val < 10 ? '0' + val : val);
const formatTime = (time) => {
	const formattedEta = new Date(time);
	const hour = formattedEta.getHours() % 12 || 12,
		min = zeroPad(formattedEta.getMinutes()),
		// sec = zeroPad(formattedEta.getSeconds()),
		ampm = (formattedEta.getHours() >= 13 ? 'pm' : 'am');
	return `${hour}:${min} ${ampm}`;
};

// This array maps 1:1 to the durValues array below
const durationIncrements = ['day', 'hour', 'min', 'second'];
const formatDuration = (duration) => {
	duration = Math.ceil(duration);
	const durValues = [
		Math.floor(duration / (60 * 60 * 24)),  // lol we can stop at days
		Math.floor(duration / (60 * 60)) % 24,
		Math.floor(duration / 60) % 60,
		duration % 60
	];

	// It's only useful to show the two largest increments
	const durParts = [];
	for (let i = 0, useful = 0; i < durValues.length && useful < 2; i++) {
		if (durValues[i] || useful) {
			useful++;
		}
		// `zero` values are not displayed, but still counted as useful
		if (durValues[i]) {
			// stack up the number, unit, and pluralize the unit
			durParts[i] = durValues[i] + ' ' + durationIncrements[i] + (durValues[i] === 1 ? '' : 's');
		}
	}
	// Prune the empty ones and join the rest.
	return durParts.filter(part => !!part).join(' ');
};

const AppBase = kind({
	name: 'App',

	defaultProps: {
		eta: 0,
		duration: 0
	},

	styles: {
		css,
		className: 'app'
	},

	render: ({adContent, duration, eta, ipAddress, popupOpen, setScreen, showAd, togglePopup, url, ...rest}) => {
		return (
			<Column {...rest}>
				{eta ? <Cell shrink>
					<Row>
						<Cell component={LabeledItem} label="Remaining" spotlightDisabled>{formatDuration(duration)}</Cell>
						<Cell component={LabeledItem} label="ETA" spotlightDisabled>{formatTime(eta)}</Cell>
					</Row>
				</Cell> : null}
				<Cell>
					<Button style={{position: 'absolute', zIndex: 1}} icon="plug" onClick={togglePopup} />
					<Row className={css.bodyRow}>
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
				</Cell>
				<Popup
					open={popupOpen}
					noAutoDismiss
					onClose={togglePopup}
				>
					<title>
						Select Your Screen Source
					</title>
					<p>IP Address: {ipAddress}</p>
					<buttons>
						<Button onClick={setScreen(1)}>Screen 1</Button>
						<Button onClick={setScreen(2)}>Screen 2</Button>
					</buttons>
				</Popup>
			</Column>
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
			...this.props,
			adContent,
			popupOpen,
			showAd,
			url,
			eta,
			duration
		};
		delete props.accent;
		delete props.highlight;

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

export default AgateDecorator(NetworkInfo(App));
