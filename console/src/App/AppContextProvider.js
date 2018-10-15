import React, {Component} from 'react';
import produce from 'immer';

const Context = React.createContext();

const getWeather = async (latitude, longitude) => {
	const key = process.env.REACT_APP_WEATHER_KEY; // eslint-disable-line
	if (!key) {
		console.error('Please set environment variable REACT_APP_WEATHER_KEY to your own openweathermap.org API key when you start the app.');
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
	}

	componentWillUpdate (nextProps, nextState) {
		if (this.state.userId !== nextState.userId && this.state.userSettings === nextState.userSettings) {
			this.setUserSettings(nextState.userId);
		}

		if (this.state.userId === nextState.userId && this.state.userSettings !== nextState.userSettings) {
			this.saveUserSettings(nextState.userId, nextState.userSettings, this.state.userSettings);
		}
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
			window.navigator.geolocation.getCurrentPosition((position) => {
				this.updateAppState((state) => {
					state.location.latitude = position.coords.latitude;
					state.location.longitude = position.coords.longitude;
				});
				this.setWeather(position.coords.latitude, position.coords.longitude);
			}, () => {/* some error*/},
			{enableHighAccuracy: true});
		}
	}

	setWeather = async (latitude, longitude) => {
		let weatherData;
		try {
			weatherData = await getWeather(latitude, longitude);
		} catch (error) {
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
