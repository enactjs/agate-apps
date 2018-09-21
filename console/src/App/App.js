import {forward, handle} from '@enact/core/handle';
import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Column} from '@enact/ui/Layout';
import compose from 'ramda/src/compose';
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
import {observer, Provider} from "mobx-react";
import { observable, computed, action, decorate } from "mobx";

import css from './App.less';

add('backspace', 8);

class UserSettings {
    fontSize;

    setFontSize(size){
		this.fontSize = size;
		console.log(this.fontSize);
	}
}
const UserSettingsDecorator = decorate(UserSettings, {
	fontSize: observable,
	setFontSize: action
})

const userSettings = new UserSettingsDecorator({fontSize: 12});


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
		showPopup,
		showBasicPopup,
		showDateTimePopup,
		skinName,
		...rest
	}) => {
		console.log(rest)
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
					/>
					<DisplaySettings
						onUserSettingsChange={onUserSettingsChange}
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
				// skin: props.defaultSkin || 'carbon', // 'titanium' alternate.
				userSettings: {
					userId: 1,
					skin: props.defaultSkin || 'carbon'
				}
			};
		}

		componentDidMount(){
			if(!JSON.parse(window.localStorage.getItem(`user${this.state.userId}`))){
				console.log('saved');
				window.localStorage.setItem(`user${this.state.userSettings.userId}`, JSON.stringify({...this.state.userSettings}));
			}
			this.setState({
				userSettings: JSON.parse(window.localStorage.getItem(`user${this.state.userSettings.userId}`))
			})
		}

		onUserSettingsChange = (ev) => {
			this.setState((prevState) => {
				return {userSettings: {...prevState.userSettings, ...ev}}
			}, () => {
				window.localStorage.setItem(`user${this.state.userSettings.userId}`, JSON.stringify(this.state.userSettings))
			});
		}

		onSelect = (ev) => {
			console.log(ev);
			const index = ev.selected;
			this.props.onSelect({index});
			this.setState(state => state.index === index ? null : {index})
		}

		onSkinChange = () => {
			this.setState(({userSettings}) => {
				return (
					{userSettings: {
						skin: (userSettings.skin === 'carbon' ? 'titanium' : 'carbon')
					}}
				)
			});
		};

		onTabChange = (index) => {
			this.props.onSelect({index});
			this.setState(state => state.index === index ? null : {index})
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
				<Provider userSettings={userSettings}>
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
						showPopup={this.state.showPopup}
						showBasicPopup={this.state.showBasicPopup}
						showDateTimePopup={this.state.showDateTimePopup}
						skin={this.state.userSettings.skin}
						skinName={this.state.userSettings.skin}
					/>
					</Provider>
			);
		}
	};
});




const AppDecorator = compose(
	AppState,
	observer,
	AgateDecorator
);

const App = AppDecorator(AppBase);

export default App;
