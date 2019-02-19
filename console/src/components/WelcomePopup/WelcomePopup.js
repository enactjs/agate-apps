import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
// import {Panel, Panels} from '@enact/agate/Panels';
import {Panel} from '@enact/agate/Panels';
// import Skinnable from '@enact/agate/Skinnable';
// import {handle, forProp, forward, returnsTrue} from '@enact/core/handle';
import {handle, forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import {Column, Row, Cell} from '@enact/ui/Layout';
// import {fadeIn, fadeOut, reverse} from '@enact/ui/ViewManager/arrange';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import CompactHeater from '../CompactHeater';
import CompactMultimedia from '../CompactMultimedia';
import CompactWeather from '../CompactWeather';
import MapController from '../MapController';

import UserAvatar from '../UserAvatar';

import css from './WelcomePopup.module.less';

const getCompactComponent = ({components, key, onSendVideo}) => {
	let Component;

	switch (components[key]) {
		case 'multimedia':
			Component = (<CompactMultimedia className={css.widget} direction="horizontal" noExpandButton onSendVideo={onSendVideo} screenIds={[1]} />);
			break;
		case 'heater':
			Component = (<CompactHeater className={css.widget} noExpandButton />);
			break;
		default:
			Component = (<CompactWeather className={css.widget} noExpandButton />);
	}

	return Component;
};

// const currentTime = () => new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

// const WelcomePanel = Skinnable({defaultSkin: 'carbon'}, Panel);

// const Arranger = {
// 	enter: reverse(fadeIn),
// 	leave: reverse(fadeOut)
// };

// const UserSelectionPanel = kind({
// 	name: 'UserSelectionPanel',
//
// 	render: ({onSelectUser, users}) => {
// 		return (
// 			<WelcomePanel className={css.userSelectionPanel}>
// 				<Divider slot="header" className={css.header}>Welcome</Divider>
// 				<Row align="center space-around" className={css.bodyRow}>
// 					{users.map((user, index) => (
// 						<Cell shrink key={'userKey' + index}>
// 							<UserAvatar size="large" userId={index} onClick={onSelectUser}>
// 								{user}
// 							</UserAvatar>
// 						</Cell>
// 					))}
// 				</Row>
// 			</WelcomePanel>
// 		);
// 	}
// });

const WelcomePopupBase = kind({
	name: 'WelcomePopup',

	propTypes: {
		updateAppState: PropTypes.func.isRequired,
		components: PropTypes.object,
		// index: PropTypes.number,
		// onCancelSelect: PropTypes.func,
		onClose: PropTypes.func,
		onContinue: PropTypes.func,
		// onSelectUser: PropTypes.func,
		onSendVideo: PropTypes.func,
		// onShowWelcome: PropTypes.func,
		profileName: PropTypes.string,
		// updateUser: PropTypes.func,
		userId: PropTypes.number
	},

	// defaultProps: {
	// 	index: 0
	// },

	styles: {
		css,
		className: 'welcomePopup'
	},

	handlers: {
		handleClose: handle(
			forward('onContinue'),
			forward('onClose')
		)// ,
		// handleTransition: handle(
		// 	forProp('index', 1),
		// 	returnsTrue((ev, {selected, updateUser}) => updateUser({selected})),
		// 	forward('onShowWelcome')
		// )
	},

	computed: {
		// className: ({index, styler}) => styler.append({
		// 	useWelcomeBackground: index < 2
		// }),
		// usersList: ({usersList}) => {
		// 	const users = [];
		// 	for (const user in usersList) {
		// 		users.push(usersList[user]);
		// 	}
		// 	return users;
		// },
		small1Component: (props) => getCompactComponent({...props, key: 'small1'}),
		small2Component: (props) => getCompactComponent({...props, key: 'small2'}),
		time: () => {
			const now = new Date();
			let h = now.getHours();
			let m = now.getMinutes();
			const ampm = (h >= 12 ? 'pm' : 'am');
			if (h > 12) h -= 12;
			if (m < 10) m = '0' + m;
			return <React.Fragment><em>{h}:{m}</em> {ampm}</React.Fragment>;
		}
	},

	render: ({
		handleClose,
		// handleTransition,
		// index,
		// onCancelSelect,
		// onSelectUser,
		profileName,
		small1Component: Small1Component,
		small2Component: Small2Component,
		time,
		userId,
		// usersList,
		...rest
	}) => {
		delete rest.components;
		delete rest.onClose;
		delete rest.onContinue;
		delete rest.onSendVideo;
		// delete rest.onShowWelcome;
		delete rest.setDestination; // This needs to be assigned to somewhere. Most likely, this just needs to be toggling `navigating`, since the destination is set elsewhere.
		delete rest.updateAppState;
		// delete rest.updateUser;

		return (
			<FullscreenPopup {...rest}>
				{/* <Panels arranger={Arranger} index={index} enteringProp="hideChildren" onTransition={handleTransition}> */}
				{/* <UserSelectionPanel users={usersList} onSelectUser={onSelectUser} /> */}
				{/* <WelcomePanel /> */}
				<Panel className={css.panel} css={css}>
					<Row className={css.welcome}>
						<Cell className={css.left} size="33%">
							<Column>
								<Cell shrink className={css.headerCell}>
									<Row>
										<Cell className={css.avatar} shrink>
											<UserAvatar css={css} userId={userId - 1} /* onClick={onCancelSelect} */ />
										</Cell>
										<Cell className={css.activeName}>
											<Column align="start center">
												<Cell shrink>Greetings</Cell>
												<Cell component="em" shrink>{profileName}!</Cell>
											</Column>
										</Cell>
									</Row>
								</Cell>
								<Cell shrink className={css.contentCell + ' ' + css.time}>
									{time}
								</Cell>
								<Cell shrink className={css.contentCell + ' ' + css.divider} component={Divider} />
								<Cell className={css.contentCell}>
									{Small1Component}
								</Cell>
								<Cell shrink className={css.contentCell + ' ' + css.divider} component={Divider} />
								<Cell className={css.contentCell}>
									{Small2Component}
								</Cell>
								<Cell className={css.contentCell} component={Button} highlighted onClick={handleClose} shrink>Let&apos;s Go!</Cell>
							</Column>
						</Cell>
						<Cell>
							<MapController
								noStartStopToggle
								locationSelection
								autonomousSelection
								noExpandButton
								noFollowButton
							/>
						</Cell>
					</Row>
				</Panel>
				{/* </Panels> */}
			</FullscreenPopup>
		);
	}
});

const WelcomePopupState = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'WelcomePopupState';

		// static propTypes = {
		// 	open: PropTypes.bool,
		// 	skin: PropTypes.string
		// }

		// constructor (props) {
		// 	super(props);
		// 	this.state = {
		// 		index: 0,
		// 		selected: null
		// 	};
		// }

		// componentWillReceiveProps (nextProps) {
		// 	if (this.props.open && !nextProps.open) {
		// 		this.setState({index: 0});
		// 	}
		// }

		// handleSelectUser = ({selected}) => {
		// 	this.setState({index: 1, selected});
		// }

		// handleCancelSelect = () => {
		// 	this.setState({index: 0});
		// }

		handleContinue = () => {
			this.props.updateAppState((state) => {
				if (state.navigation.autonomous) {
					state.navigation.navigating = true;
				}
			});
		}

		// handleShowWelcome = () => {
		// 	this.setState(({index}) => index === 1 ? {index: ++index} : null);
		// }

		setDestination = ({destination}) => {
			this.props.updateAppState((state) => {
				state.navigation.destination = destination;
			});
		}

		// updateUser = ({selected}) => {
		// 	this.props.updateAppState((state) => {
		// 		state.userId = selected + 1;
		// 	});
		// }

		render () {
			// const {index} = this.state;

			return (
				<Wrapped
					{...this.props}
					// index={index}
					// onSelectUser={this.handleSelectUser}
					// onCancelSelect={this.handleCancelSelect}
					onContinue={this.handleContinue}
					// onShowWelcome={this.handleShowWelcome}
					// selected={this.state.selected}
					// updateUser={this.updateUser}
					setDestination={this.setDestination}
				/>
			);
		}
	};
});

const AppContextDecorator = AppContextConnect(({/* usersList, */updateAppState, userId, userSettings}) => {
	return {
		components: (userSettings.components && userSettings.components.welcome),
		profileName: userSettings.name,
		userId,
		// usersList: usersList,
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
