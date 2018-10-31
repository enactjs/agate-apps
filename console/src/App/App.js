// External
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import {add} from '@enact/core/keymap';
import {forward, handle} from '@enact/core/handle';
import {Cell, Column} from '@enact/ui/Layout';
import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import ToggleButton from '@enact/agate/ToggleButton';
import Popup from '@enact/agate/Popup';
import DateTimePicker from '@enact/agate/DateTimePicker';
import {TabbedPanels} from '@enact/agate/Panels';
import React from 'react';
import compose from 'ramda/src/compose';

// Data Services
import ServiceLayer from '../data/ServiceLayer';

// Components
import Clock from '../components/Clock';
import CustomLayout from '../components/CustomLayout';
import UserSelectionPopup from '../components/UserSelectionPopup';
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

// Local Components
import AppStateConnect from './AppContextConnect';

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
	'dashboard'
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
		layoutArrangeableToggle,
		layoutArrangeable,
		onTogglePopup,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		onToggleUserSelectionPopup,
		setDestination,
		showPopup,
		showBasicPopup,
		showDateTimePopup,
		showUserSelectionPopup,
		skinName,
		...rest
	}) => {
		delete rest.accent;
		delete rest.highlight;
		// delete rest.setDestination;
		delete rest.endNavigation;
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
							<Cell shrink>
								<Button type="grid" icon="user" small onTap={onToggleUserSelectionPopup} />
								<Button type="grid" icon="series" small onTap={updateSkin} />
								<ToggleButton defaultSelected={layoutArrangeable} underline type="grid" toggleOnLabel="Finish" toggleOffLabel="Edit" small onToggle={layoutArrangeableToggle} />
							</Cell>
						</Column>
					</afterTabs>
					<Home
						onSelect={onSelect}
						setDestination={setDestination}
						arrangeable={layoutArrangeable}
					/>
					<Phone arrangeable={layoutArrangeable} />
					<Hvac arrangeable={layoutArrangeable} />
					<Radio arrangeable={layoutArrangeable} />
					<AppList
						onSelect={onSelect}
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}
					/>
					<MapView setDestination={setDestination} />
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
				</TabbedPanels>
				<UserSelectionPopup
					onClose={onToggleUserSelectionPopup}
					open={showUserSelectionPopup}
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
				showUserSelectionPopup: false,
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

		onToggleUserSelectionPopup = () => {
			this.setState(({showUserSelectionPopup}) => ({showUserSelectionPopup: !showUserSelectionPopup}));
		};

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
					onToggleUserSelectionPopup={this.onToggleUserSelectionPopup}
					orientation={(skin !== 'carbon') ? 'horizontal' : 'vertical'}
					showPopup={this.state.showPopup}
					showBasicPopup={this.state.showBasicPopup}
					showDateTimePopup={this.state.showDateTimePopup}
					showUserSelectionPopup={this.state.showUserSelectionPopup}
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
		layoutArrangeable: userSettings.arrangements.arrangeable,
		layoutArrangeableToggle: ({selected}) => {
			updateAppState((state) => {
				state.userSettings.arrangements.arrangeable = selected;
			});
		},
		// setDestination: ({destination, navigating}) => {
		// 	updateAppState((state) => {
		// 		state.navigation.destination = destination;
		// 		if (navigating != null) {
		// 			state.navigation.navigating = navigating;
		// 		}
		// 	});
		// },
		// endNavigation: ({navigating}) => {
		// 	updateAppState((state) => {
		// 		state.navigation.navigating = navigating;
		// 	});
		// },
		updateSkin: () => {
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
	ServiceLayer,
	AgateDecorator
);

const App = AppDecorator(AppBase);

export default App;
export {
	App,
	getPanelIndexOf
};
