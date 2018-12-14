import React, {Component} from 'react';
import produce from 'immer';
import {assocPath, mergeDeepRight, path} from 'ramda';

import appConfig from '../App/configLoader';
import userPresetsForDemo from './userPresetsForDemo';

const Context = React.createContext();

const getWeather = async (latitude, longitude) => {
	const key = appConfig.weatherApiKey;
	if (!key) {
		console.error('Please set `weatherApiKey` key in your `config.js` file to your own openweathermap.org API key.');
	}

	const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;
	const threeHourUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;

	const response = await window.fetch(currentUrl);
	const json = await response.json();

	const threeHoursResponse = await window.fetch(threeHourUrl);
	const threeHourJson = await threeHoursResponse.json();

	return {
		current: json,
		threeHour: threeHourJson
	};
};

const defaultUserSettings = {
	arrangements: {
		arrangeable: false,
		dashboard: {},
		home: {},
		hvac: {},
		phone: {},
		radio: {}
	},
	climate: {
		acSelected: false,
		autoSelected: false,
		fanSpeed: 0,
		leftHeat: false,
		leftTemp: 0,
		recirculate: false,
		rightHeat: false,
		rightTemp: 0
	},
	components: {
		welcome: {}
	},
	colorAccent: '#cccccc',
	colorHighlight: '#66aabb',
	fontSize: 0,
	name: '',
	skin: 'carbon'
	// topLocations: []
};

class AppContextProvider extends Component {
	constructor (props) {
		super(props);
		this.watchPositionId = null;  // Store the reference to the position watcher.
		this.state = {
			appState:{
				showPopup: false,
				showBasicPopup: false,
				showDateTimePopup: false,
				showUserSelectionPopup: false,
				showAppList: false,
				showWelcomePopup: 'defaultShowWelcomePopup' in props ? Boolean(props.defaultShowWelcomePopup) : true
			},
			userId: 1,
			userSettings: this.getDefaultUserSettings(1, props),
			usersList: {},
			connections: {
				serviceLayer: false
			},
			location: {
				lat: 0,
				lon: 0,
				linearVelocity: 0,
				orientation: 0
			},
			navigation: {
				autonomous: true,
				description: '',
				destination: null,
				distance: 0,
				duration: 0,
				eta: 0,
				navigating: false,
				startTime: 0
			},
			weather: {}
		};
	}

	componentWillMount () {
		// If there are no users in the list when we load for the first time, stamp some out and prepare the system.
		if (this.getAllSavedUserIds().length <= 0) {
			this.resetAll();
		} else {
			this.updateUserSettings(['arrangements', 'arrangeable'], false);
		}

		this.updateAppState((state) => {
			state.usersList = this.getUserNames();
		});

		this.setUserSettings(this.state.userId);
		this.setLocation();
	}

	componentWillUpdate (nextProps, nextState) {
		if (this.state.userId !== nextState.userId && this.state.userSettings === nextState.userSettings) {
			this.setUserSettings(nextState.userId);
		}

		if (this.state.userId === nextState.userId && this.state.userSettings !== nextState.userSettings) {
			if (nextState.userSettings !== this.state.userSettings) {
				this.saveUserSettings(nextState.userId, nextState.userSettings);
			}
		}
	}

	componentWillUnmount () {
		this.unsetLocationMonitoring();
	}

	getDefaultUserSettings = (userId, props) => {
		const userKey = `user${userId}`;
		const demoUser = userPresetsForDemo[userKey];

		props = props || this.props;  // Use the supplied props or the current props
		const settings = Object.assign({}, demoUser ? demoUser : defaultUserSettings);

		// Respect the app's defaultSkin prop
		if (props.defaultSkin) {
			settings.skin = props.defaultSkin;
		}

		// The default user has no `name`, so we'll look it up in the presets, and if it's not there, we'll just use the user-key.
		if (!demoUser) {
			settings.name = userKey;
		}

		return settings;
	}

	getUserNames = () => {
		const users = {};
		this.getAllSavedUserIds().forEach(userKey => {
			const userSettings = this.loadUserSettings(userKey);
			users[userKey] = userSettings.name;
		});
		return users;
	}

	loadSavedUserSettings = (userId) => {
		if (!this.loadUserSettings(userId)) {
			// By providing no settings object here, we are able to clone the current user's settings into the nem user.
			this.saveUserSettings(userId, this.state.userSettings);
		}

		const userSettings = this.loadUserSettings(userId);

		// Apply a consistent (predictable) set of object keys for consumers, merging in new keys since their last visit
		return mergeDeepRight(this.state.userSettings, userSettings);
	}

	loadUserSettings = (userId) => {
		return JSON.parse(window.localStorage.getItem(`user${userId}`)) || this.getDefaultUserSettings(userId);
	}

	saveUserSettings = (userId, userSettings) => {
		window.localStorage.setItem(`user${userId}`, JSON.stringify(userSettings));
	}

	deleteUserSettings = (userId) => {
		window.localStorage.removeItem(`user${userId}`);
	}

	updateUserSettings = (key, value) => {
		this.getAllSavedUserIds().forEach(userKey => {
			const settings = this.loadUserSettings(userKey);

			if (path(key, settings) !== value) {
				this.saveUserSettings(userKey, assocPath(key, value, settings));
			}
		});
	}

	setUserSettings = (userId = this.state.userId, userSettings) => {
		const settings = userSettings || this.loadSavedUserSettings(userId);

		this.updateAppState((state) => {
			state.userSettings = settings;
		});
	}

	getAllSavedUserIds = () => {
		// Read the user database and return just a list of the registered id numbers
		return Object.keys(window.localStorage)
			.filter(key => (key.indexOf('user') === 0))
			.map(key => parseInt(key.replace('user', '')));
	}

	resetUserSettings = () => {
		this.deleteUserSettings(this.state.userId);
		this.setUserSettings(this.state.userId);
	}

	resetAll = () => {
		const userIds = this.getAllSavedUserIds();
		userIds.forEach(this.deleteUserSettings);
		this.resetUserSettings();
		this.repopulateUsersForDemo();
	}

	repopulateUsersForDemo = () => {
		for (const userId in userPresetsForDemo) {
			this.saveUserSettings(userId.replace('user', ''), userPresetsForDemo[userId]);
		}
	}

	setLocation = () => {
		if (window.navigator.geolocation) {
			this.watchPositionId = window.navigator.geolocation.watchPosition((position) => {
				// This code will only fire when the watchPosition changes, not necessarily when
				// the app state's location changes. Dev Note: Find a way to trigger the weather to
				// be set if the location changes and disable this watch in that case, but reconnect
				// it if the connection to the service layer drops.
				if (this.state.connections.serviceLayer) {
					// We happened to get our data from elsewhere
					this.setWeather(this.state.location.lat, this.state.location.lon);
				} else {
					// Just use location services.
					this.updateAppState((state) => {
						state.location.lat = position.coords.latitude;
						state.location.lon = position.coords.longitude;
					});
					this.setWeather(position.coords.latitude, position.coords.longitude);
				}
			}, (error) => {
				console.error('Location error:', error);
			},
			{enableHighAccuracy: true});
		}
	}

	unsetLocationMonitoring = () => {
		window.navigator.geolocation.clearWatch(this.watchPositionId);
	}

	setWeather = async (latitude, longitude) => {
		let weatherData;
		try {
			weatherData = await getWeather(latitude, longitude);
		} catch (error) {
			console.error('Weather error:', error);
			this.updateAppState((state) => {
				state.weather.status = 'error';
			});

			return;
		}

		this.updateAppState((state) => {
			state.weather = weatherData;
			state.weather.status = {status: 'success'};
		});
	}

	updateAppState = (cb) => {
		this.setState(
			produce(cb)
		);
	}

	render () {
		const context = {
			...this.state,
			getUserNames: this.getUserNames,
			updateAppState: this.updateAppState,
			resetUserSettings: this.resetUserSettings,
			resetAll: this.resetAll
		};

		return (
			<Context.Provider value={context}>
				<PureFragment>
					{this.props.children}
				</PureFragment>
			</Context.Provider>
		);
	}
}

class PureFragment extends React.PureComponent {
	render () {
		return (
			<React.Fragment>
				{this.props.children}
			</React.Fragment>
		);
	}
}

export default AppContextProvider;
export {AppContextProvider, Context as AppContext};
