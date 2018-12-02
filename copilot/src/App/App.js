import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import LabeledItem from '@enact/agate/LabeledItem';
import PropTypes from 'prop-types';
import React from 'react';

import Communicator from '../../../components/Communicator';
import ScreenSelectionPopup from '../../../components/ScreenSelectionPopup';
import NetworkInfo from '../../../components/NetworkInfo';

import appConfig from './configLoader';
import css from './App.less';

const screenIds = [1, 2];

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

const IFrame = kind({
	name: 'IFrame',
	render: (props) => {
		return (
			<Cell
				{...props}
				component="iframe"
			/>
		);
	}
});

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

	render: ({adContent, duration, eta, ipAddress, popupOpen, showAd, onSetScreen, onTogglePopup, url, ...rest}) => {
		return (
			<Column {...rest}>
				{eta ? <Cell shrink>
					<Row>
						<Cell component={LabeledItem} label="Remaining" spotlightDisabled>{formatDuration(duration)}</Cell>
						<Cell component={LabeledItem} label="ETA" spotlightDisabled>{formatTime(eta)}</Cell>
					</Row>
				</Cell> : null}
				<Cell>
					<Button style={{position: 'absolute', zIndex: 1}} icon="plug" onClick={onTogglePopup} />
					<Row className={css.bodyRow}>
						<IFrame allow="autoplay" className={css.iframe} src={url} />
						{!showAd ? null : <Cell className={css.adSpace} shrink>
							{adContent}
						</Cell>}
					</Row>
				</Cell>
				<ScreenSelectionPopup
					open={popupOpen}
					noAutoDismiss
					onClose={onTogglePopup}
					onSelect={onSetScreen}
					screenIds={screenIds}
					title="Select Your Screen Source"
				>
					<p>IP Address: {ipAddress}</p>
				</ScreenSelectionPopup>
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
			duration: null,
			eta: null,
			popupOpen: true,
			screenId: 1,
			showAd: this.props.showAd || false,
			url: ''
		};
		// Job to control hiding ads
		this.adTimer = new Job(this.onHideAdSpace);
	}

	componentWillUnmount () {
		this.adTimer.stop();
	}

	onHideAdSpace = () => {
		this.setState({adContent: '', showAd: false});
	};

	onPlayVideo = ({url}) => {
		this.setState({url});
	};

	// Note for this one we may need to include some logic to actually switch channels.
	// for example if we're on screen 2, but we want to tune into screen 1 we can just switch.
	onSetScreen = ({screenId}) => {
		// set the new screen ID
		this.setState({screenId});

		// close the popup
		this.onTogglePopup();
	};

	onShowAdSpace = ({adContent, duration}) => {
		this.setState({adContent, showAd: true});
		this.adTimer.startAfter(duration);
	};

	onShowETA = ({eta, duration}) => {
		this.setState({eta, duration});
		this.adTimer.startAfter(duration);
	};

	onTogglePopup = () => {
		this.setState(({popupOpen}) => {
			return {popupOpen: !popupOpen};
		});
	};

	render () {
		const {adContent, duration, eta, popupOpen, showAd, url} = this.state;
		const props = {
			...this.props,
			adContent,
			duration,
			eta,
			popupOpen,
			showAd,
			url
		};
		delete props.accent;
		delete props.highlight;

		return (
			<React.Fragment>
				<Communicator
					host={appConfig.communicationServerHost}
					screenId={this.state.screenId}
					onPlayVideo={this.onPlayVideo}
					onShowAd={this.onShowAdSpace}
					onShowETA={this.onShowETA}
				/>
				<AppBase
					{...props}
					onSetScreen={this.onSetScreen}
					onTogglePopup={this.onTogglePopup}
				/>
			</React.Fragment>
		);
	}
}

export default AgateDecorator(NetworkInfo(App));
