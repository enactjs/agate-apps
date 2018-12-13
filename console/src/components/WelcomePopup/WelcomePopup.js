import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import GridListImageItem from '@enact/agate/GridListImageItem';
import {Panel, Panels} from '@enact/agate/Panels';
import Skinnable from '@enact/agate/Skinnable';
import {handle, forProp, forward, returnsTrue} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import {Column, Row, Cell} from '@enact/ui/Layout';
import {fadeIn, fadeOut, reverse} from '@enact/ui/ViewManager/arrange';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import CompactHeater from '../CompactHeater';
import CompactMultimedia from '../CompactMultimedia';
import CompactWeather from '../CompactWeather';
import MapController from '../MapController';

import lauraAvatar from '../../../assets/laura.png';
import thomasAvatar from '../../../assets/thomas.png';

import css from './WelcomePopup.less';

const userAvatars = [lauraAvatar, thomasAvatar];

const getCompactComponent = ({components, key, onSendVideo}) => {
	let Component;

	switch (components[key]) {
		case 'multimedia':
			Component = (<CompactMultimedia onSendVideo={onSendVideo} />);
			break;
		case 'heater':
			Component = (<CompactHeater />);
			break;
		default:
			Component = (<CompactWeather />);
	}

	return Component;
};

const currentTime = () => new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

const WelcomePanel = Skinnable({defaultSkin: 'carbon'}, Panel);

const Arranger = {
	enter: reverse(fadeIn),
	leave: reverse(fadeOut)
};

const UserSelectionAvatar = kind({
	name: 'UserSelectionAvatar',

	handlers: {
		onClick: (ev, {index, onSelectUser}) => {
			onSelectUser({selected: index});
		}
	},

	computed: {
		source: ({index}) => (userAvatars[index] || 'none'),
		style: ({style, index}) => ({
			...style,
			'--user-index': index
		})
	},

	render: ({children, ...rest}) => {
		delete rest.onSelectUser;
		return (
			<GridListImageItem
				{...rest}
				css={css}
				caption={children}
			/>
		);
	}
});

const UserSelectionPanel = kind({
	name: 'UserSelectionPanel',

	render: ({onSelectUser, users}) => {
		return (
			<WelcomePanel className={css.userSelectionPanel}>
				<Divider slot="header" className={css.header}>Welcome</Divider>
				<Row align="center space-around" className={css.bodyRow}>
					{users.map((user, index) => (
						<Cell shrink key={'userKey' + index}>
							<UserSelectionAvatar index={index} onSelectUser={onSelectUser}>
								{user}
							</UserSelectionAvatar>
						</Cell>
					))}
				</Row>
			</WelcomePanel>
		);
	}
});

const WelcomePopupBase = kind({
	name: 'WelcomePopup',

	propTypes: {
		updateAppState: PropTypes.func.isRequired,
		components: PropTypes.object,
		index: PropTypes.number,
		onCancelSelect: PropTypes.func,
		onClose: PropTypes.func,
		onContinue: PropTypes.func,
		onSelectUser: PropTypes.func,
		onSendVideo: PropTypes.func,
		onShowWelcome: PropTypes.func,
		profileName: PropTypes.string,
		updateUser: PropTypes.func,
		userId: PropTypes.number
	},

	defaultProps: {
		index: 0
	},

	styles: {
		css,
		className: 'welcomePopup'
	},

	handlers: {
		handleClose: handle(
			forward('onContinue'),
			forward('onClose')
		),
		handleTransition: handle(
			forProp('index', 1),
			returnsTrue((ev, {selected, updateUser}) => updateUser({selected})),
			forward('onShowWelcome')
		)
	},

	computed: {
		className: ({index, styler}) => styler.append({
			useWelcomeBackground: index < 2
		}),
		usersList: ({usersList}) => {
			const users = [];
			for (const user in usersList) {
				users.push(usersList[user]);
			}
			return users;
		},
		small1Component: (props) => getCompactComponent({...props, key: 'small1'}),
		small2Component: (props) => getCompactComponent({...props, key: 'small2'})
	},

	render: ({
		handleClose,
		handleTransition,
		index,
		onCancelSelect,
		onSelectUser,
		profileName,
		small1Component: Small1Component,
		small2Component: Small2Component,
		userId,
		usersList,
		...rest
	}) => {
		delete rest.components;
		delete rest.onClose;
		delete rest.onContinue;
		delete rest.onSendVideo;
		delete rest.onShowWelcome;
		delete rest.setDestination; // This needs to be assigned to somewhere. Most likely, this just needs to be toggling `navigating`, since the destination is set elsewhere.
		delete rest.updateAppState;
		delete rest.updateUser;

		return (
			<FullscreenPopup {...rest}>
				<Panels arranger={Arranger} index={index} enteringProp="hideChildren" onTransition={handleTransition}>
					<UserSelectionPanel users={usersList} onSelectUser={onSelectUser} />
					<WelcomePanel />
					<Panel>
						<Row className={css.welcome}>
							<Cell className={css.left} size="33%">
								<Column>
									<Cell shrink>
										<Row>
											<Cell className={css.activeAvatar} shrink>
												<UserSelectionAvatar index={userId - 1} onSelectUser={onCancelSelect}>
													{profileName}
												</UserSelectionAvatar>
											</Cell>
											<Cell>
												<Column align="start center">
													<Cell shrink>Hi</Cell>
													<Cell className={css.activeName} shrink>{profileName}!</Cell>
												</Column>
											</Cell>
										</Row>
									</Cell>
									<Cell shrink>
										{currentTime()}
									</Cell>
									<Cell className={css.smallComponent}>
										{Small1Component}
									</Cell>
									<Cell className={css.smallComponent}>
										{Small2Component}
									</Cell>
									<Cell component={Button} onClick={handleClose} shrink>{"Let's Go!"}</Cell>
								</Column>
							</Cell>
							<Cell>
								<MapController
									noStartStopToggle
									locationSelection
									autonomousSelection
								/>
							</Cell>
						</Row>
					</Panel>
				</Panels>
			</FullscreenPopup>
		);
	}
});

const WelcomePopupState = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'WelcomePopupState';

		static propTypes = {
			open: PropTypes.bool,
			skin: PropTypes.string
		}

		constructor (props) {
			super(props);
			this.state = {
				index: 0,
				selected: null
			};
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.open && !nextProps.open) {
				this.setState({index: 0});
			}
		}

		handleSelectUser = ({selected}) => {
			this.setState({index: 1, selected});
		}

		handleCancelSelect = () => {
			this.setState({index: 0});
		}

		handleContinue = () => {
			this.props.updateAppState((state) => {
				if (state.navigation.autonomous) {
					state.navigation.navigating = true;
				}
			});
		}

		handleShowWelcome = () => {
			this.setState(({index}) => index === 1 ? {index: ++index} : null);
		}

		setDestination = ({destination}) => {
			this.props.updateAppState((state) => {
				state.navigation.destination = destination;
			});
		}

		updateUser = ({selected}) => {
			this.props.updateAppState((state) => {
				state.userId = selected + 1;
			});
		}

		render () {
			const {index} = this.state;

			return (
				<Wrapped
					{...this.props}
					index={index}
					onSelectUser={this.handleSelectUser}
					onCancelSelect={this.handleCancelSelect}
					onContinue={this.handleContinue}
					onShowWelcome={this.handleShowWelcome}
					selected={this.state.selected}
					updateUser={this.updateUser}
					setDestination={this.setDestination}
				/>
			);
		}
	};
});

const AppContextDecorator = AppContextConnect(({usersList, updateAppState, userId, userSettings}) => {
	return {
		components: (userSettings.components && userSettings.components.welcome),
		profileName: userSettings.name,
		userId,
		usersList: usersList,
		updateAppState
	};
});

const WelcomePopup = AppContextDecorator(
	WelcomePopupState(
		WelcomePopupBase
	)
);

export default WelcomePopup;
export {
	WelcomePopup,
	WelcomePopupBase
};
