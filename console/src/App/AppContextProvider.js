import React, {Component} from 'react';
import produce from "immer";

const Context = React.createContext();

class AppContextProvider extends Component {
	constructor(props){
		super(props)
		this.state = {
			userId: 1,
			userSettings: {
				color: '#FFFFFF',
				fontSize: 0,
				skin: props.defaultSkin || 'carbon',
			}
		}
	}

	componentDidMount(){
		this.setUserSettings(this.state.userId);
	}

	componentWillUpdate(nextProps, nextState){
		if(this.state.userId !== nextState.userId && this.state.userSettings === nextState.userSettings){
			this.setUserSettings(nextState.userId);
		}

		if(this.state.userId === nextState.userId && this.state.userSettings !== nextState.userSettings){
			this.saveUserSettings(nextState.userId, nextState.userSettings, this.state.userSettings)
		}
	}

	loadSavedUserSettings = (userId) => {
		if(!JSON.parse(window.localStorage.getItem(`user${userId}`))){
			window.localStorage.setItem(`user${this.state.userId}`, JSON.stringify({...this.state.userSettings}));
		}

		return JSON.parse(window.localStorage.getItem(`user${userId}`));
	}

	saveUserSettings = (userId, userSettings, prevUserSettings) => {
		if(userSettings !== prevUserSettings){
			window.localStorage.setItem(`user${userId}`, JSON.stringify(userSettings))
		}
	}

	setUserSettings = (userId) => {
		const settings = this.loadSavedUserSettings(userId);

		this.setState(
			produce((draft) => {
				draft.userSettings = settings
			})
		)
	}

	updateAppState = (cb, afterCB) => {
		const prevState = this.state;
		this.setState(
			produce(cb),
			() => {
				if(afterCB){
					afterCB(this.state, prevState);
				}
			}
		)
	}

	render() {
		const context = {
			...this.state,
			updateAppState: this.updateAppState,
			onSwitchUser: this.onSwitchUser
		}

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
	render() {
		return (
			<React.Fragment>
				{this.props.children}
			</React.Fragment>
		);
	}
}

export default AppContextProvider;
export {AppContextProvider, Context as AppContext}