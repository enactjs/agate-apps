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
import AppList from '../views/AppList';
import Settings from '../views/Settings';
import DisplaySettings from '../views/DisplaySettings';

import css from './App.less';

import AppContextConnect from './AppContextConnect';

add('backspace', 8);

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},
	handlers: {
		onSkinChange: (update) => () => {
			update((draft) => {
				draft.userSettings.skin = draft.userSettings.skin === 'carbon' ? 'titanium' : 'carbon'
			})
		}
	},
	render: ({
		index,
		onSelect,
		onSkinChange,
		onTogglePopup,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		showPopup,
		showBasicPopup,
		showDateTimePopup,
		skinName,
		updateAppState,
		...rest
	}) => {
		return (
			<div>
				<TabbedPanels
					{...rest}
					tabs={[
						{title: 'Home', icon: 'denselist'},
						{title: 'Phone', icon: 'phone'},
						{title: 'Climate', icon: 'temperature'},
						{title: 'Apps', icon: 'list'}
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
							<Cell shrink component={Button} type="grid" icon="fullscreen" small onTap={onSkinChange(updateAppState)} />
						</Column>
					</afterTabs>
					<Home
						onSelect={onSelect}
					/>
					<Phone />
					{/* eslint-disable-next-line */}
					<HVAC />
					<AppList
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}/>
					<Settings
						onSelect={onSelect}
						onToggleDateTimePopup={onToggleDateTimePopup}
					/>
					<DisplaySettings/>
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
				showAppList: false,
				skin: props.defaultSkin || 'carbon' // 'titanium' alternate.
			};
		}

		onSelect = handle(
			forward('onSelect'),
			(ev) => {
				const {index} = ev;
				this.setState(state => state.index === index ? null : {index});
			}
		).bind(this);

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
				<Wrapped
					{...props}
					index={this.state.index}
					onSelect={this.onSelect}
					onTogglePopup={this.onTogglePopup}
					onToggleBasicPopup={this.onToggleBasicPopup}
					onToggleDateTimePopup={this.onToggleDateTimePopup}
					orientation={(this.props.skin === 'titanium') ? 'horizontal' : 'vertical'}
					showPopup={this.state.showPopup}
					showBasicPopup={this.state.showBasicPopup}
					showDateTimePopup={this.state.showDateTimePopup}
					skinName={this.props.skin}
				/>
			);
		}
	};
});

const AppDecorator = compose(
	AppContextConnect((context) => ({
		skin: context.userSettings.skin
	})),
	AppState,
	AgateDecorator
);



const App = AppDecorator(AppBase);

export default App;
