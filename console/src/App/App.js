// External
import kind from '@enact/core/kind';
import {add} from '@enact/core/keymap';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import {Cell, Column} from '@enact/ui/Layout';
import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {ToggleButtonBase} from '@enact/agate/ToggleButton';
import Popup from '@enact/agate/Popup';
import DateTimePicker from '@enact/agate/DateTimePicker';
import {TabbedPanels} from '@enact/agate/Panels';
import React from 'react';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';

// Data Services
import ServiceLayer from '../data/ServiceLayer';

// Components
import Clock from '../components/Clock';
import CustomLayout from '../components/CustomLayout';
import UserSelectionPopup from '../components/UserSelectionPopup';
import WelcomePopup from '../components/WelcomePopup';
import AppList from '../views/AppList';
import Home from '../views/Home';
import Hvac from '../views/HVAC';
import MapView from '../views/Map';
import Phone from '../views/Phone';
import Radio from '../views/Radio';
import Settings from '../views/Settings';
import DisplaySettings from '../views/DisplaySettings';
import Weather from '../views/WeatherPanel';
import Dashboard from '../views/Dashboard';
import Multimedia from '../views/Multimedia';

// Local Components
import AppContextConnect from './AppContextConnect';

// CSS/LESS Styling
import css from './App.less';


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
	'dashboard',
	'multimedia'
];
// Look up a panel index by name, using the above list as the directory listing.
const getPanelIndexOf = (panelName) => panelIndexMap.indexOf(panelName);

const AppBase = kind({
	name: 'App',

	propTypes: {
		updateAppState: PropTypes.func.isRequired
	},

	styles: {
		css,
		className: 'app'
	},

	handlers: {
		onSelect: handle(
			adaptEvent((ev, {updateAppState}) => {
				const {index = getPanelIndexOf(ev.view || 'home')} = ev;
				updateAppState((state) => {
					state.appState.index = state.appState.index === index ? null : index;
				});
				return {index};
			}, forward('onSelect'))
		),

		onToggleUserSelectionPopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showUserSelectionPopup = !state.appState.showUserSelectionPopup;
			});
		},
		onToggleDateTimePopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showDateTimePopup = !state.appState.showDateTimePopup;
			});
		},
		onToggleWelcomePopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showWelcomePopup = !state.appState.showWelcomePopup;
			});
		},
		onTogglePopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showPopup = !state.appState.showPopup;
			});
		},
		onToggleBasicPopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showBasicPopup = !state.appState.showBasicPopup;
			});
		},
		onResetAll: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.index = 0;
				state.appState.showWelcomePopup = true;
				state.appState.showUserSelectionPopup = false;
			});
		},
		layoutArrangeableToggle: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.userSettings.arrangements.arrangeable = !state.userSettings.arrangements.arrangeable;
			});
		},
		updateSkin: (ev, {updateAppState}) => {
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
	},

	render: ({
		index,
		layoutArrangeable,
		layoutArrangeableToggle,
		onResetAll,
		onSelect,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		onTogglePopup,
		onToggleUserSelectionPopup,
		onToggleWelcomePopup,
		orientation,
		resetPosition,
		sendVideo,
		showBasicPopup,
		showDateTimePopup,
		showPopup,
		showUserSelectionPopup,
		showWelcomePopup,
		skinName,
		updateSkin,
		...rest
	}) => {
		delete rest.accent;
		delete rest.highlight;
		delete rest.endNavigation;
		delete rest.defaultIndex;
		delete rest.defaultSkin;
		delete rest.updateAppState;

		return (
			<div {...rest}>
				<TabbedPanels
					orientation={orientation}
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
						<Column align="center space-around">
							<Cell shrink>
								<Clock />
							</Cell>
							<Cell shrink>
								<Button type="grid" icon="user" small onTap={onToggleUserSelectionPopup} />
								<Button type="grid" icon="series" small onTap={updateSkin} />
								<ToggleButtonBase selected={layoutArrangeable} underline type="grid" toggleOnLabel="Finish" toggleOffLabel="Edit" small onTap={layoutArrangeableToggle} />
							</Cell>
						</Column>
					</afterTabs>
					<Home
						arrangeable={layoutArrangeable}
						onCompactExpand={onSelect}
						onSelect={onSelect}
						onSendVideo={sendVideo}
					/>
					<Phone arrangeable={layoutArrangeable} />
					<Hvac arrangeable={layoutArrangeable} />
					<Radio arrangeable={layoutArrangeable} />
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
					<Dashboard
						arrangeable={layoutArrangeable}
						onSelect={onSelect}
					/>
					<Multimedia onSendVideo={sendVideo} />
				</TabbedPanels>
				<UserSelectionPopup
					onClose={onToggleUserSelectionPopup}
					onResetAll={onResetAll}
					open={showUserSelectionPopup}
					resetPosition={resetPosition}
				/>
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
				<WelcomePopup
					noAnimation
					onClose={onToggleWelcomePopup}
					onSendVideo={sendVideo}
					open={showWelcomePopup}
				/>
			</div>
		);
	}
});


const AppDecorator = compose(
	ServiceLayer,
	AppContextConnect(({appState, userSettings, updateAppState}) => ({
		accent: userSettings.colorAccent,
		highlight: userSettings.colorHighlight,
		index: appState.index,
		layoutArrangeable: userSettings.arrangements.arrangeable,
		orientation: (userSettings.skin !== 'carbon') ? 'horizontal' : 'vertical',
		showAppList: appState.showAppList,
		showBasicPopup: appState.showBasicPopup,
		showDateTimePopup: appState.showDateTimePopup,
		showPopup: appState.showPopup,
		showUserSelectionPopup: appState.showUserSelectionPopup,
		showWelcomePopup: appState.showWelcomePopup,
		skin: userSettings.skin,
		skinName: userSettings.skin,
		updateAppState
	})),
	AgateDecorator
);

const App = AppDecorator(AppBase);

export default App;
export {
	App,
	getPanelIndexOf
};
