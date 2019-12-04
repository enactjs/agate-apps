// External
import kind from '@enact/core/kind';
import {add} from '@enact/core/keymap';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import {Cell, Column, Row} from '@enact/ui/Layout';
import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import Popup from '@enact/agate/Popup';
import DateTimePicker from '@enact/agate/DateTimePicker';
import {TabbedPanels} from '@enact/agate/Panels';
import React from 'react';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';

// Data Services
import ServiceLayer from '../data/ServiceLayer';

// Components
import UserSelectionPopup from '../components/UserSelectionPopup';
import UserAvatar from '../components/UserAvatar';
import Clock from '../components/Clock';
import WelcomePopup from '../components/WelcomePopup';
import AppList from '../views/AppList';
import Home from '../views/Home';
import Hvac from '../views/HVAC';
import MapView from '../views/Map';
import Phone from '../views/Phone';
import Radio from '../views/Radio';
import Settings from '../views/Settings';
import ThemeSettings from '../views/ThemeSettings';
import Weather from '../views/WeatherPanel';
import Dashboard from '../views/Dashboard';
import Multimedia from '../views/Multimedia';

// Local Components
import AppContextConnect from './AppContextConnect';

// CSS/LESS Styling
import css from './App.module.less';

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
	'settings/theme',
	'weather',
	'dashboard',
	'multimedia'
];
// Look up a panel index by name, using the above list as the directory listing.
const getPanelIndexOf = (panelName) => panelIndexMap.indexOf(panelName);

const PanelSwitchingIconButton = kind({
	name: 'PanelSwitchingIconButton',
	propTypes: {
		index: PropTypes.number,
		onSelect: PropTypes.func,
		view: PropTypes.string
	},
	defaultProps: {
		view: 'home'
	},
	handlers: {
		onSelect: handle(
			adaptEvent((ev, {view}) => ({view}), forward('onSelect'))
		)
	},
	computed: {
		selected: ({index, view}) => (index === getPanelIndexOf(view))
	},
	render: ({onSelect, ...rest}) => {
		delete rest.index;
		delete rest.view;

		return <Button {...rest} onClick={onSelect} />;
	}
});

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
		layoutArrangeableToggle: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.userSettings.arrangements.arrangeable = !state.userSettings.arrangements.arrangeable;
			});
		},
		// onToggleProfileEdit: (ev, {updateAppState}) => {
		// 	updateAppState((state) => {
		// 		state.appState.showProfileEdit = !state.appState.showProfileEdit;
		// 	});
		// },
		onToggleDateTimePopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showDateTimePopup = !state.appState.showDateTimePopup;
			});
		},
		onToggleDestinationReachedPopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showDestinationReachedPopup = !state.appState.showDestinationReachedPopup;
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
		onToggleUserSelectionPopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showUserSelectionPopup = !state.appState.showUserSelectionPopup;
			});
		},
		onResetAll: (ev, {onSelect, updateAppState}) => {
			onSelect({index: 0});
			updateAppState((state) => {
				state.userId = 1;
				state.appState.showDestinationReachedPopup = false;
				state.appState.showProfileEdit = false;
				state.appState.showUserSelectionPopup = false;
				state.appState.showWelcomePopup = true;
			});
		},
		onSelect: handle(
			forward('onSelect'),
			(ev, {updateAppState}) => {
				updateAppState((state) => {
					// turn off arrangeable when switching panels.
					state.userSettings.arrangements.arrangeable = false;
				});
			}
		)
	},

	render: ({
		index,
		layoutArrangeable,
		layoutArrangeableToggle,
		onResetAll,
		onSelect,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		onToggleDestinationReachedPopup,
		onTogglePopup,
		// onToggleProfileEdit,
		onToggleUserSelectionPopup,
		onToggleWelcomePopup,
		orientation,
		prevIndex,
		resetCopilot,
		resetPosition,
		reloadApp,
		sendVideo,
		showBasicPopup,
		showDateTimePopup,
		showDestinationReachedPopup,
		showPopup,
		showUserSelectionPopup,
		showWelcomePopup,
		skinName,
		userId,
		...rest
	}) => {
		delete rest.accent;
		delete rest.endNavigation;
		delete rest.highlight;
		delete rest.showAppList;
		delete rest.updateAppState;

		const copperSkinFamily = (skinName === 'copper' || skinName === 'copper-day' || skinName === 'cobalt' || skinName === 'cobalt-day');

		return (
			<div {...rest}>
				<TabbedPanels
					orientation={orientation}
					tabs={[
						{title: 'Home', icon: 'home'},
						{title: 'Phone', icon: 'phone'},
						{title: 'Climate', icon: 'climate'},
						{title: 'Radio', icon: 'radio'},
						{title: 'Apps', icon: 'apps'}
					]}
					noCloseButton
					onSelect={onSelect}
					index={index}
				>
					<beforeTabs>
						<div className={css.beforeTabs}>
							<UserAvatar
								className={css.avatar}
								userId={userId - 1}
								onClick={onToggleUserSelectionPopup}
							/>
							{copperSkinFamily ? <Clock className={css.clock} /> : null}
						</div>
					</beforeTabs>
					<afterTabs>
						<Column
							className={css.afterTabs}
							align={(copperSkinFamily ? 'start center' : 'center space-around')}
						>
							{copperSkinFamily ? null : <Cell shrink><Clock /></Cell>}
							<Cell shrink className={css.buttons}>
								<Row align={(copperSkinFamily ? 'center start' : 'center space-around')}>
									<Cell shrink>
										<PanelSwitchingIconButton
											index={index}
											onSelect={onSelect}
											view="settings/theme"
											icon="edit"
										/>
									</Cell>
									<Cell shrink>
										<Button
											onClick={layoutArrangeableToggle}
											selected={layoutArrangeable}
											icon="display"
										/>
									</Cell>
								</Row>
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
						onReloadApp={reloadApp}
						onToggleDateTimePopup={onToggleDateTimePopup}
					/>
					<ThemeSettings onSelect={onSelect} prevIndex={prevIndex} />
					<Weather />
					<Dashboard
						arrangeable={layoutArrangeable}
						// onSelect={onSelect}
					/>
					<Multimedia onSendVideo={sendVideo} screenIds={[0, 1]} />
				</TabbedPanels>
				<UserSelectionPopup
					onClose={onToggleUserSelectionPopup}
					onResetAll={onResetAll}
					open={showUserSelectionPopup}
					onResetPosition={resetPosition}
					onResetCopilot={resetCopilot}
				/>
				{/* <ProfileDrawer
					index={index}
					getPanelIndexOf={getPanelIndexOf}
					onProfileEditEnd={onToggleProfileEdit}
					onResetAll={onResetAll}
					onResetPosition={resetPosition}
					onResetCopilot={resetCopilot}
					onSelect={onSelect}
					showUserSelectionPopup={showUserSelectionPopup}
				/>*/}
				<Popup
					onClose={onToggleBasicPopup}
					open={showBasicPopup}
				>
					{`Popup for ${skinName} skin`}
				</Popup>
				<Popup
					onClose={onToggleDestinationReachedPopup}
					open={showDestinationReachedPopup}
				>
					Destination reached!
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
					className={css.dateTimePopup}
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

const AppIndex = (Wrapped) => {
	return class extends React.Component {
		static displayName = 'AppIndex'

		constructor (props) {
			super(props);
			this.state = {
				index: props.defaultIndex || 0
			};
		}

		onSelect = handle(
			adaptEvent((ev) => {
				const {index = getPanelIndexOf(ev.view || 'home')} = ev;
				this.setState(state => state.index === index ? null : {prevIndex: state.index, index});
				return {index};
			}, forward('onSelect'))
		).bind(this);

		render () {
			const {...rest} = this.props;
			delete rest.defaultIndex;
			return (
				<Wrapped
					{...rest}
					index={this.state.index}
					prevIndex={this.state.prevIndex}
					onSelect={this.onSelect}
				/>
			);
		}
	};
};

const AppDecorator = compose(
	ServiceLayer,
	AppContextConnect(({appState, userSettings, userId, updateAppState}) => ({
		accent: userSettings.colorAccent,
		highlight: userSettings.colorHighlight,
		layoutArrangeable: userSettings.arrangements.arrangeable,
		orientation: (userSettings.skin !== 'carbon') ? 'horizontal' : 'vertical',
		showAppList: appState.showAppList,
		showBasicPopup: appState.showBasicPopup,
		showDateTimePopup: appState.showDateTimePopup,
		showDestinationReachedPopup: appState.showDestinationReachedPopup,
		showPopup: appState.showPopup,
		showUserSelectionPopup: appState.showUserSelectionPopup,
		showWelcomePopup: appState.showWelcomePopup,
		skin: userSettings.skin,
		skinName: userSettings.skin,
		updateAppState,
		userId
	})),
	AppIndex,
	AgateDecorator
);

const App = AppDecorator(AppBase);

export default App;
export {
	App,
	getPanelIndexOf
};
