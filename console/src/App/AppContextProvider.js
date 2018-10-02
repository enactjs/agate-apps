import React, {Component} from 'react';
import produce from "immer"
import { Pure } from '@enact/ui/internal/Pure/Pure';

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
			},
			updateAppState: this.updateAppState,
			onSwitchUser: this.onSwitchUser
		}
	}

	componentDidMount(){
		this.loadUserSettings(this.state.userId);
	}

	loadUserSettings = (userId) => {
		if(!JSON.parse(window.localStorage.getItem(`user${this.state.userId}`))){
			window.localStorage.setItem(`user${this.state.userId}`, JSON.stringify({...this.state.userSettings}));
		}

		this.setState(
			produce((draft) => {
				draft.userSettings = JSON.parse(window.localStorage.getItem(`user${userId}`))
			})
		)
	}

	saveUserSettingsLocally = (userId, hasChanged) => {
		if(hasChanged){
			window.localStorage.setItem(`user${userId}`, JSON.stringify(this.state.userSettings))
		}
	}

	// Catch all way to update state
	updateAppState = (cb) => {
		const prevUserSettings = this.state.userSettings
		this.setState(
			produce(cb),
			() => {
				this.saveUserSettingsLocally(this.state.userId, this.state.userSettings !== prevUserSettings)
			}
		)
	}

	// If you want to be more specific about updating state. Similar to a redux action/reducer.
	onSwitchUser = ({value}) => {
		this.setState(
			produce((draft) => {
				draft.userId = value + 1
			}),
			() => this.loadUserSettings(this.state.userId)
		)
	}

	render() {
		return (
			<Context.Provider value={this.state}>
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