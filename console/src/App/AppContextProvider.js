import React, {Component} from 'react';
import produce from 'immer';
import openSocket from 'socket.io-client';

const Context = React.createContext();

const getWeather = async (latitude, longitude) => {
	const key = process.env.REACT_APP_WEATHER_KEY; // eslint-disable-line
	if (!key) {
		console.error('Please set environment variable REACT_APP_WEATHER_KEY to your own openweathermap.org API key when you start the app.');
	}

	const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${key}&units=imperial`;
	const threeHourUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${key}&units=imperial`;

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
				colorAccent: '#cccccc',
				colorHighlight: '#66aabb',
				fontSize: 0,
				skin: props.defaultSkin || 'carbon'
			},
			location: {},
			weather: {}
		};
	}

	componentWillMount () {
		this.setUserSettings(this.state.userId);
		this.setLocation();
		const socket = openSocket('http://localhost:3000');
		socket.on('server event', event => console.log(event));
		socket.emit('video', {
			url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F9gag%2Fvideos%2F10155906890961840%2F&show_text=0&width=476'
		});
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

		return JSON.parse(window.localStorage.getItem(`user${userId}`));
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
				this.updateAppState((state) => {
					state.location.latitude = position.coords.latitude;
					state.location.longitude = position.coords.longitude;
				});
				this.setWeather(position.coords.latitude, position.coords.longitude);
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
