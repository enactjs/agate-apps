import React, {Component} from 'react';
import produce from 'immer';
import {mergeDeepRight} from 'ramda';
import appConfig from '../../config';

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

class AppContextProvider extends Component {
	constructor (props) {
		super(props);
		this.watchPositionId = null;  // Store the reference to the position watcher.
		this.state = {
			userId: 1,
			userSettings: {
				arrangements: {
					arrangeable: false,
					dashboard: {},
					home: {},
					hvac: {},
					phone: {},
					radio: {}
				},
				colorAccent: '#cccccc',
				colorHighlight: '#66aabb',
				fontSize: 0,
				skin: props.defaultSkin || 'carbon'
			},
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
				destination: {
					lat: 0,
					lon: 0
				},
				distance: 0,
				duration: 0,
				eta: 0,
				startTime: 0,
				navigating: false
			},
			weather: {}
		};
	}

	componentWillMount () {
		this.setUserSettings(this.state.userId);
		this.setLocation();
	}

	componentWillUpdate (nextProps, nextState) {
		if (this.state.userId !== nextState.userId && this.state.userSettings === nextState.userSettings) {
			this.setUserSettings(nextState.userId);
		}

		if (this.state.userId === nextState.userId && this.state.userSettings !== nextState.userSettings) {
			this.saveUserSettings(nextState.userId, nextState.userSettings, this.state.userSettings);
		}
	}

	componentWillUnmount () {
		this.unsetLocationMonitoring();
	}

	loadSavedUserSettings = (userId) => {
		if (!JSON.parse(window.localStorage.getItem(`user${userId}`))) {
			window.localStorage.setItem(`user${userId}`, JSON.stringify({...this.state.userSettings}));
		}

		const userStorage = JSON.parse(window.localStorage.getItem(`user${userId}`));

		// Apply a consistent (predictable) set of object keys for consumers, merging in new keys since their last visit
		return mergeDeepRight(this.state.userSettings, userStorage);
	}

	saveUserSettings = (userId, userSettings, prevUserSettings) => {
		if (userSettings !== prevUserSettings) {
			window.localStorage.setItem(`user${userId}`, JSON.stringify(userSettings));
		}
	}

	setUserSettings = (userId) => {
		const settings = this.loadSavedUserSettings(userId);

		this.updateAppState((state) => {
			state.userSettings = settings;
		});
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
			updateAppState: this.updateAppState
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
