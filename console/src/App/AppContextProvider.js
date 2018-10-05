import React, {Component} from 'react';
import produce from 'immer';
import {token} from '../config.json';

const Context = React.createContext();

const getWeather = async (latitude, longitude) => {
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${token}`;
	const response = await window.fetch(url);
	const json = await response.json();

	return json;
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

		this.setState(
			produce((draft) => {
				draft.userSettings = settings;
			})
		);
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
