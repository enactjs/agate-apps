import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Column} from '@enact/ui/Layout';
import compose from 'ramda/src/compose';
import {forward, handle} from '@enact/core/handle';
import {fromEvent} from 'rxjs';
import hoc from '@enact/core/hoc';
import {add} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import DateTimePicker from '@enact/agate/DateTimePicker';
import React from 'react';
import {TabbedPanels} from '@enact/agate/Panels';

import Clock from '../components/Clock';
import Home from '../views/Home';
import HVAC from '../views/HVAC';
import Phone from '../views/Phone';
import Settings from '../views/Settings';
import DisplaySettings from '../views/DisplaySettings';

import css from './App.less';

add('backspace', 8);

class IFrame extends React.Component {
	constructor(props) {
		super(props);
	}
	readFromStorage = (userId) => {
		return JSON.parse(this.contentWindow.localStorage.getItem(`user${userId}`));
	};
	saveToStorage = (userSettings) => {
		this.contentWindow.localStorage.setItem(`user${userSettings.userId}`, JSON.stringify({...userSettings}));
	};
	shouldComponentUpdate() {
		return false;
	}
	render() {
		return (
			<iframe {...this.props} ref={(f) => {this.contentWindow = f.contentWindow;}} />
		);
	}
}

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: ({
		index,
		onSelect,
		onSkinChange,
		onTogglePopup,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		onUserSettingsChange,
		settings,
		showPopup,
		showBasicPopup,
		showDateTimePopup,
		skinName,
		...rest
	}) => {
		return (
			<div>
				<TabbedPanels
					{...rest}
					tabs={[
						{title: 'Home', icon: 'denselist'},
						{title: 'Phone', icon: 'phone'},
						{title: 'Climate', icon: 'temperature'}
					]}
					onSelect={onSelect}
					selected={index}
					index={index}
				>
					<afterTabs>
						<Column align="center space-evenly">
							<Cell shrink>
								<Clock />
							</Cell>
							<Cell shrink component={Button} type="grid" icon="fullscreen" small onTap={onSkinChange} />
						</Column>
					</afterTabs>
					<Home
						onSelect={onSelect}
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}
					/>
					<Phone />
					{/* eslint-disable-next-line */}
					<HVAC />
					<Settings
						onSelect={onSelect}
						onToggleDateTimePopup={onToggleDateTimePopup}
						onUserSettingsChange={onUserSettingsChange}
						settings={settings}
					/>
					<DisplaySettings
						onUserSettingsChange={onUserSettingsChange}
						settings={settings}
					/>
				</TabbedPanels>
				<Popup
					onClose={onToggleBasicPopup}
					open={showBasicPopup}
				>
					{`Popup for ${skinName} skin`}
				</Popup>
				<Popup
					onClose={onTogglePopup}
					open={showPopup}
					closeButton
				>
					<title>
						{`Popup for ${skinName} skin`}
					</title>
					This is an example of a popup with a body section and a title. Plus there&apos;re buttons!
					<buttons>
						<Button>Transport Mode</Button>
					</buttons>
				</Popup>
				<Popup
					onClose={onToggleDateTimePopup}
					open={showDateTimePopup}
					closeButton
				>
					<title>
						Date & Time
					</title>
					<DateTimePicker onClose={onToggleDateTimePopup}/>
				</Popup>
			</div>
		);
	}
});

const AppState = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'AppState';
		constructor (props) {
			super(props);
			this.state = {
				index: props.defaultIndex || 0,
				showPopup: false,
				showBasicPopup: false,
				showDateTimePopup: false,
				userSettings: {
					userId: 1
				}
			};
		}

		componentDidMount(){
			if (!this.readFromLocalStorage(this.state.userSettings.userId)) {
				console.log('saved');
				this.saveToLocalStorage(this.state.userSettings);
			}

			// hydrate
			this.hydrateFromLocalStorage(this.state.userSettings.userId);

			// set up observable settings subscription
			this.settings = fromEvent(window, 'storage');
			this.subscription = this.settings.subscribe((ev) => {
				const settings = JSON.parse(ev.newValue);
				this.applyUserSettings({
					settings: {
						...this.state.userSettings, // not perfect since we were using setState callback to get the previous user settings
						...settings
					}
				});
			});
		}

		componentWillUnmount() {
			// unsubscribe settings subscription
			this.subscription.unsubscribe();
		}

		applyUserSettings({callback, settings}) {
			this.setState((prevState) => {
				return {userSettings: {...prevState.userSettings, ...settings}};
			}, callback ? callback : null);
		}

		hydrateFromLocalStorage(userId) {
			const {fontSize, skin} = this.readFromLocalStorage(userId);
			const settings = {
				fontSize,
				skin: skin || 'carbon'
			};
			this.applyUserSettings({settings});
		}

		readFromLocalStorage(userId) {
			return this.storageFrame.readFromStorage(userId);
		}

		saveToLocalStorage() {
			const {userSettings} = this.state;
			this.storageFrame.saveToStorage(userSettings);
		}

		onUserSettingsChange = (ev) => {
			const {userId} = ev;
			const {userSettings} = this.state;
			let settings = {};
			// if the userId changed, apply those settings
			if (userId && userId !== userSettings.userId) {
				settings = Object.assign({}, this.readFromLocalStorage(userId));
			} else {
				settings = Object.assign({}, userSettings, ev);
			}

			this.applyUserSettings({
				callback: this.saveToLocalStorage,
				settings
			});
		};

		onSelect = handle(
			forward('onSelect'),
			(ev) => {
				const {index} = ev;
				this.setState(state => state.index === index ? null : {index});
			}
		).bind(this);

		onSkinChange = () => {
			this.applyUserSettings({
				callback: this.saveToLocalStorage,
				settings: {
					skin: this.state.userSettings.skin === 'carbon' ? 'titanium' : 'carbon' // not perfect since we were using setState callback to get the previous state of `skin`
				}
			});
		};

		onTabChange = (index) => {
			this.props.onSelect({index});
			this.setState(state => state.index === index ? null : {index});
		}

		onTogglePopup = () => {
			this.setState(({showPopup}) => ({showPopup: !showPopup}));
		};

		onToggleBasicPopup = () => {
			this.setState(({showBasicPopup}) => ({showBasicPopup: !showBasicPopup}));
		};

		onToggleDateTimePopup = () => {
			this.setState(({showDateTimePopup}) => ({showDateTimePopup: !showDateTimePopup}));
		};

		render () {
			const props = {...this.props};

			delete props.defaultIndex;
			delete props.defaultSkin;

			return (
				<div>
					<Wrapped
						{...props}
						index={this.state.index}
						onSelect={this.onSelect}
						onUserSettingsChange={this.onUserSettingsChange}
						onSkinChange={this.onSkinChange}
						onTogglePopup={this.onTogglePopup}
						onToggleBasicPopup={this.onToggleBasicPopup}
						onToggleDateTimePopup={this.onToggleDateTimePopup}
						orientation={(this.state.userSettings.skin === 'titanium') ? 'horizontal' : 'vertical'}
						settings={this.state.userSettings}
						showPopup={this.state.showPopup}
						showBasicPopup={this.state.showBasicPopup}
						showDateTimePopup={this.state.showDateTimePopup}
						skin={this.state.userSettings.skin}
						skinName={this.state.userSettings.skin}
					/>
					<IFrame
						ref={(f) => {this.storageFrame = f;}}
						src="about:blank"
						style={{
							visibility: 'hidden'
						}}
					/>
				</div>
			);
		}
	};
});

const AppDecorator = compose(
	AppState,
	AgateDecorator
);

const App = AppDecorator(AppBase);

export default App;
