/* eslint-disable react-hooks/rules-of-hooks */

import Button from '@enact/agate/Button';
import DateTimePicker from '@enact/agate/DateTimePicker';
import {TabbedPanels} from '@enact/agate/Panels';
import Popup from '@enact/agate/Popup';
import ThemeDecorator from '@enact/agate/ThemeDecorator';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import {add} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import {Cell, Column, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {Component, useCallback, useContext, useEffect, useState} from 'react';

import Clock from '../components/Clock';
// import ProfileDrawer from '../components/ProfileDrawer';
import UserAvatar from '../components/UserAvatar';
import UserSelectionPopup from '../components/UserSelectionPopup';
import WelcomePopup from '../components/WelcomePopup';
import ServiceLayer from '../data/ServiceLayer';
import useLinearSkinColor from '../useLinearSkinColor/useLinearSkinColor';
import AppList from '../views/AppList';
import Dashboard from '../views/Dashboard';
import Home from '../views/Home';
import Hvac from '../views/HVAC';
import MapView from '../views/Map';
import Multimedia from '../views/Multimedia';
import Phone from '../views/Phone';
import Radio from '../views/Radio';
import Settings from '../views/Settings';
import ThemeSettings from '../views/ThemeSettings';
import Weather from '../views/WeatherPanel';

import AppContextConnect from './AppContextConnect';
import {AppContext} from './AppContextProvider';

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

	functional: true,

	propTypes: {
		updateAppState: PropTypes.func.isRequired,
		accent: PropTypes.string,
		background: PropTypes.string,
		defaultIndex: PropTypes.number,
		dynamicColor: PropTypes.bool,
		endNavigation: PropTypes.func,
		fakeTime: PropTypes.number,
		fakeTimeEnabled: PropTypes.bool,
		highlight: PropTypes.string,
		index: PropTypes.number,
		layoutArrangeable: PropTypes.bool,
		onSelect: PropTypes.func,
		orientation: PropTypes.string,
		prevIndex: PropTypes.number,
		reloadApp: PropTypes.func,
		resetCopilot: PropTypes.func,
		resetPosition: PropTypes.func,
		sendSkinSettings: PropTypes.func,
		sendVideo: PropTypes.func,
		showAppList: PropTypes.bool,
		showBasicPopup: PropTypes.bool,
		showDateTimePopup: PropTypes.bool,
		showDestinationReachedPopup: PropTypes.bool,
		showPopup: PropTypes.bool,
		showUserSelectionPopup: PropTypes.bool,
		showWelcomePopup: PropTypes.bool,
		skinName: PropTypes.string,
		skinVariants: PropTypes.string,
		useFakeTime: PropTypes.bool,
		userId: PropTypes.number
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
		onToggleDynamicColor: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.userSettings.dynamicColor = ev.selected;
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
		accent,
		background,
		fakeTime,
		fakeTimeEnabled,
		highlight,
		index,
		layoutArrangeable,
		layoutArrangeableToggle,
		onResetAll,
		onSelect,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		onToggleDestinationReachedPopup,
		onToggleDynamicColor,
		onTogglePopup,
		// onToggleProfileEdit,
		onToggleUserSelectionPopup,
		onToggleWelcomePopup,
		orientation,
		prevIndex,
		resetCopilot,
		resetPosition,
		reloadApp,
		sendSkinSettings,
		sendVideo,
		showBasicPopup,
		showDateTimePopup,
		showDestinationReachedPopup,
		showPopup,
		showUserSelectionPopup,
		showWelcomePopup,
		skinName,
		skinVariants,
		userId,
		...rest
	}) => {
		delete rest.dynamicColor;
		delete rest.endNavigation;
		delete rest.showAppList;
		delete rest.updateAppState;

		const copperSkinFamily = (skinName === 'copper' || skinName === 'cobalt');

		const [automaticSkinVariant, setAutomaticSkinVariant] = useState(true);
		const context = useContext(AppContext);
		const dynamicColorActive = context.userSettings.dynamicColor;

		const handleAutomaticSkinVariant = useCallback(() => {
			setAutomaticSkinVariant(value => !value);
		}, [setAutomaticSkinVariant]);

		useEffect(() => {
			context.updateAppState((state) => {
				state.userSettings.useFakeTime = fakeTimeEnabled;
			});
		}, [fakeTimeEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

		useEffect (() => {
			context.updateAppState((state) => {
				state.userSettings.colorAccentManual = context.userSettings.colorAccent;
				state.userSettings.colorHighlightManual = context.userSettings.colorHighlight;
				state.userSettings.skinVariantsManual = context.userSettings.skinVariants;
			});
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		useEffect(() => {
			if (dynamicColorActive) {
				context.updateAppState((state) => {
					state.userSettings.colorAccent = accent;
					state.userSettings.colorBackground = background;
					state.userSettings.colorHighlight = highlight;
					state.userSettings.skinVariants = automaticSkinVariant ? skinVariants ? skinVariants : '' : state.userSettings.skinVariantsManual;
					sendSkinSettings({accent: accent, background: background, highlight: highlight, skin: context.userSettings.skin, skinVariants: state.userSettings.skinVariants});
				});
			} else {
				context.updateAppState((state) => {
					state.userSettings.colorAccent = state.userSettings.colorAccentManual;
					state.userSettings.colorBackground = null;
					state.userSettings.colorHighlight = state.userSettings.colorHighlightManual;
					state.userSettings.skinVariants = state.userSettings.skinVariantsManual;
					sendSkinSettings({accent: state.userSettings.colorAccentManual, background: null, highlight: state.userSettings.colorHighlightManual, skin: context.userSettings.skin, skinVariants: state.userSettings.skinVariantsManual});
				});
			}

		}, [accent, automaticSkinVariant, background, context.userSettings.dynamicColor, highlight, skinVariants]); // eslint-disable-line react-hooks/exhaustive-deps

		return (
			// eslint-disable-next-line react/no-unknown-property
			<div accent={accent} highlight={highlight} {...rest}>
				<TabbedPanels
					className={css.tabbedPanels}
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
								css={css}
								userId={userId - 1}
								onClick={onToggleUserSelectionPopup}
							/>
							{copperSkinFamily ?
								<Clock
									className={css.clock}
									dynamicColor={context.userSettings.dynamicColor}
									fakeTime={fakeTimeEnabled}
									fakeTimeIndex={fakeTime}
								/> :
								null}
						</div>
					</beforeTabs>
					<afterTabs>
						<Column
							className={css.afterTabs}
							align={(copperSkinFamily ? 'start center' : 'center space-around')}
						>
							{copperSkinFamily ? null : <Cell shrink>
								<Clock
									dynamicColor={context.userSettings.dynamicColor}
									fakeTime={fakeTimeEnabled}
									fakeTimeIndex={fakeTime}
								/>
							</Cell>}
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
					<ThemeSettings
						automaticSkinVariant={automaticSkinVariant}
						onSelect={onSelect}
						onSendSkinSettings={sendSkinSettings}
						onToggleAutomaticSkinVariant={handleAutomaticSkinVariant}
						onToggleDynamicColor={onToggleDynamicColor}
						prevIndex={prevIndex}
					/>
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
	return class extends Component {
		static displayName = 'AppIndex';

		static propTypes = {
			defaultIndex: PropTypes.number
		};

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
		background: userSettings.colorBackground,
		dynamicColor: userSettings.dynamicColor,
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
		skinVariants: userSettings.skinVariants,
		skinName: userSettings.skin,
		useFakeTime: userSettings.useFakeTime,
		updateAppState,
		userId
	})),
	AppIndex,
	ThemeDecorator
);

const ThemedAppBase = (props) => {
	const {accent, highlight, skinVariants, useFakeTime, ...rest} = props;

	const [fakeTime, newAccent, newBackground, newHighlight, newSkinVariants] = useLinearSkinColor(accent, highlight, skinVariants, useFakeTime);

	delete rest.background;
	return (<AppBase accent={newAccent} background={newBackground} fakeTime={fakeTime} highlight={newHighlight} skinVariants={newSkinVariants} {...rest} />);
};

ThemedAppBase.propTypes = {
	accent: PropTypes.string,
	highlight: PropTypes.string,
	skinVariants: PropTypes.string,
	useFakeTime: PropTypes.bool
};

const ThemedApp = AppDecorator(ThemedAppBase);

export default ThemedApp;
export {
	ThemedApp,
	getPanelIndexOf
};
