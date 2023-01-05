import Button from '@enact/agate/Button';
import Item from '@enact/agate/Item';
import Skinnable from '@enact/agate/Skinnable';
import ThemeDecorator from '@enact/agate/ThemeDecorator';
import kind from '@enact/core/kind';
// import Job from '@enact/core/util/Job';
import {Cell, Column, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import {Component, Fragment} from 'react';

import Communicator from '../../../components/Communicator';
import {formatDuration, formatTime} from '../../../components/Formatter';
import NetworkInfo from '../../../components/NetworkInfo';
import ScreenSelectionPopup from '../../../components/ScreenSelectionPopup';

import appConfig from './configLoader';

import css from './App.module.less';

const screenIds = [1];
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

	propTypes: {
		adContent: PropTypes.any,
		duration: PropTypes.number || null,
		eta: PropTypes.number || null,
		ipAddress: PropTypes.string,
		onSetScreen: PropTypes.func,
		onTogglePopup: PropTypes.func,
		popupOpen: PropTypes.bool,
		showAd: PropTypes.bool,
		url: PropTypes.string
	},

	defaultProps: {
		eta: 0,
		duration: 0
	},

	styles: {
		css,
		className: 'app'
	},

	render: ({adContent, duration, eta, ipAddress, onSetScreen, onTogglePopup, popupOpen, showAd, url, ...rest}) => {
		return (
			<Column {...rest}>
				{eta ? <Cell shrink>
					<Row>
						<Cell component={Item} label="Remaining" spotlightDisabled>{formatDuration(duration, durationIncrements)}</Cell>
						<Cell component={Item} label="ETA" spotlightDisabled>{formatTime(eta)}</Cell>
					</Row>
				</Cell> : null}
				<Cell>
					<Button style={{position: 'absolute', zIndex: 1, top: '60px'}} icon="setting" onClick={onTogglePopup} />
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

const ThemedApp = ThemeDecorator(Skinnable(AppBase));

// Set the initial state, but allow for overrides
const getInitialState = ({popupOpen = true, screenId = 1} = {}) => ({
	accent: '',
	// adContent: this.props.adContent || 'Your Ad Here',
	duration: null,
	eta: null,
	highlight: '',
	popupOpen,
	screenId,
	// showAd: this.props.showAd || false,
	skin: '',
	skinVariants: '',
	url: ''
});

class App extends Component {

	static propTypes = {
		// adContent: PropTypes.string,
		// showAd: PropTypes.bool
	};

	constructor (props) {
		super(props);
		this.state = getInitialState();

		// Job to control hiding ads
		// this.adTimer = new Job(this.onHideAdSpace);
	}

	// componentWillUnmount () {
	// 	this.adTimer.stop();
	// }

	// onHideAdSpace = () => {
	// 	this.setState({adContent: '', showAd: false});
	// };

	onChangeSkinSettings = ({skinSettings}) => {
		this.setState({
			accent: skinSettings.accent,
			highlight: skinSettings.highlight,
			skin: skinSettings.skin,
			skinVariants: skinSettings.skinVariants
		});
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
		// If the popup was dismissed, leave it closed during a reset. (maintain popupOpen state through resets)
		this.setState(({popupOpen}) => getInitialState({popupOpen}));
	};

	reloadApp = () => {
		global.location.reload();
	};

	render () {
		const {accent, duration, eta, highlight, popupOpen, showAd, skin, skinVariants, url} = this.state;

		const props = {
			...this.props,
			accent,
			// adContent,
			duration,
			eta,
			highlight,
			popupOpen,
			showAd,
			skin,
			skinVariants,
			url
		};
		delete props.accent;
		delete props.highlight;
		delete props.skinVariants;

		return (
			<Fragment>
				<Communicator
					host={appConfig.communicationServerHost}
					onChangeSkinSettings={this.onChangeSkinSettings}
					onPlayVideo={this.onPlayVideo}
					onReload={this.reloadApp}
					onReset={this.resetApp}
					// onShowAd={this.onShowAdSpace}
					onShowETA={this.onShowETA}
					screenId={this.state.screenId}
				/>
				<ThemedApp
					{...props}
					accent={accent}
					highlight={highlight}
					onSetScreen={this.onSetScreen}
					onTogglePopup={this.onTogglePopup}
					skin={skin}
					skinVariants={skinVariants}
				/>
			</Fragment>
		);
	}
}

export default NetworkInfo(App);
