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
import CustomLayout from '../components/CustomLayout';
import AppList from '../views/AppList';
import Home from '../views/Home';
import HVAC from '../views/HVAC';
import MapView from '../views/Map';
import Phone from '../views/Phone';
import Radio from '../views/Radio';
import Settings from '../views/Settings';
import DisplaySettings from '../views/DisplaySettings';
import Weather from '../views/WeatherPanel';
import Multimedia from '../views/MultimediaPanel';

import AppContextConnect from './AppContextConnect';

import css from './App.less';

import AppStateConnect from './AppContextConnect';

add('backspace', 8);

// Maintain synchronization of this list with the panels included below. This maps names of panels
// panel indexes so when a new panel is updated, any references to/from other panels don't need to
// be updated.
const panelIndexMap = [
	'home',
	'phone',
	'hvac',
	'radio',
	'applist',
	'map',
	'settings',
	'settings/display',
	'weather',
	'layoutsample',
	'multimedia'
];
// Look up a panel index by name, using the above list as the directory listing.
const getPanelIndexOf = (panelName) => panelIndexMap.indexOf(panelName);

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: ({
		index,
		onSelect,
		updateSkin,
		onTogglePopup,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		showPopup,
		showBasicPopup,
		showDateTimePopup,
		skinName,
		...rest
	}) => {
		delete rest.accent;
		delete rest.highlight;
		return (
			<div>
				<TabbedPanels
					{...rest}
					tabs={[
						{title: 'Home', icon: 'denselist'},
						{title: 'Phone', icon: 'phone'},
						{title: 'Climate', icon: 'temperature'},
						{title: 'Radio', icon: 'audio'},
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
							<Cell shrink component={Button} type="grid" icon="fullscreen" small onTap={updateSkin} />
						</Column>
					</afterTabs>
					<Home
						onSelect={onSelect}
					/>
					<Phone />
					{/* eslint-disable-next-line */}
					<HVAC />
					<Radio />
					<AppList
						onSelect={onSelect}
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}
					/>
					<MapView />
					<Settings
						onSelect={onSelect}
						onToggleDateTimePopup={onToggleDateTimePopup}
					/>
					<DisplaySettings onSelect={onSelect} />
					<Weather />
					{/* arrangement={{right: 'left', left: 'bottom'}}  defaultArrangement={{right: 'left', left: 'right'}} */}
					<CustomLayout onArrange={console.log}>
						{/* <top>red top content</top> */}
						<left>yellow left content <Button>Transport Mode</Button></left>
						green body content
						<right>blue right content</right>
						<bottom>
							purple bottom content
							<Button type="grid" icon="fullscreen" small onTap={updateSkin} />
						</bottom>
					</CustomLayout>
					<Multimedia />
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
					<DateTimePicker onClose={onToggleDateTimePopup} />
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
				showAppList: false
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
			const {colorAccent, colorHighlight, skin, ...rest} = this.props;

			delete rest.defaultIndex;
			delete rest.defaultSkin;

			return (
				<Wrapped
					{...rest}
					accent={colorAccent}
					highlight={colorHighlight}
					index={this.state.index}
					onSelect={this.onSelect}
					onTogglePopup={this.onTogglePopup}
					onToggleBasicPopup={this.onToggleBasicPopup}
					onToggleDateTimePopup={this.onToggleDateTimePopup}
					orientation={(skin !== 'carbon') ? 'horizontal' : 'vertical'}
					showPopup={this.state.showPopup}
					showBasicPopup={this.state.showBasicPopup}
					showDateTimePopup={this.state.showDateTimePopup}
					skin={skin}
					skinName={skin}
				/>
			);
		}
	};
});

const AppDecorator = compose(
	AppStateConnect(({userSettings, updateAppState}) => ({
		skin: userSettings.skin,
		colorAccent: userSettings.colorAccent,
		colorHighlight: userSettings.colorHighlight,
		updateSkin:() => {
			updateAppState((state) => {
				let newSkin;
				switch (state.userSettings.skin) {
					case 'titanium': newSkin = 'electro'; break;
					case 'carbon': newSkin = 'titanium'; break;
					default: newSkin = 'carbon';
				}
				state.userSettings.skin = newSkin;
			});
		}
	})),
	AppState,
	AgateDecorator
);

const App = AppDecorator(AppBase);

export default App;
export {
	App,
	getPanelIndexOf
};
