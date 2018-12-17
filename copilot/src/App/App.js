import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Column, Row} from '@enact/ui/Layout';
// import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import LabeledItem from '@enact/agate/LabeledItem';
// import PropTypes from 'prop-types';
import React from 'react';

import Communicator from '../../../components/Communicator';
import ScreenSelectionPopup from '../../../components/ScreenSelectionPopup';
import NetworkInfo from '../../../components/NetworkInfo';
import {formatDuration, formatTime} from '../../../components/Formatter';

import appConfig from './configLoader';
import css from './App.less';

const screenIds = [1, 2];
const durationIncrements = ['day', 'hour', 'min', 'second'];

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
						<Cell component={LabeledItem} label="Remaining" spotlightDisabled>{formatDuration(duration, durationIncrements)}</Cell>
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
		// adContent: PropTypes.string,
		// showAd: PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.initialState = {
			// adContent: this.props.adContent || 'Your Ad Here',
			duration: null,
			eta: null,
			popupOpen: true,
			screenId: 1,
			// showAd: this.props.showAd || false,
			url: ''
		};
		this.state = this.initialState;
		// Job to control hiding ads
		// this.adTimer = new Job(this.onHideAdSpace);
	}

	// componentWillUnmount () {
	// 	this.adTimer.stop();
	// }

	// onHideAdSpace = () => {
	// 	this.setState({adContent: '', showAd: false});
	// };

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

	// onShowAdSpace = ({adContent, duration}) => {
	// 	this.setState({adContent, showAd: true});
	// 	this.adTimer.startAfter(duration);
	// };

	onShowETA = ({eta, duration}) => {
		this.setState({eta, duration});
		// this.adTimer.startAfter(duration);
	};

	onTogglePopup = () => {
		this.setState(({popupOpen}) => {
			return {popupOpen: !popupOpen};
		});
	};

	resetApp = () => {
		this.setState(this.initialState);
	}

	render () {
		const {duration, eta, popupOpen, showAd, url} = this.state;
		const props = {
			...this.props,
			// adContent,
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
					onReset={this.resetApp}
					// onShowAd={this.onShowAdSpace}
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
