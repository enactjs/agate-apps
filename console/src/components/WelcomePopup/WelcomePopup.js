import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import GridListImageItem from '@enact/agate/GridListImageItem';
import {Item} from '@enact/agate/Item';
import {Panel, Panels} from '@enact/agate/Panels';
import Skinnable from '@enact/agate/Skinnable';
import {handle, forProp, forward, returnsTrue} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import {Column, Row, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import CompactHeater from '../CompactHeater';
import CompactMultimedia from '../CompactMultimedia';
import CompactWeather from '../CompactWeather';
import DestinationList from '../DestinationList';
import MapCore from '../MapCore';
import {propTypeLatLonList} from '../../data/proptypes';

import steveAvatar from '../../../assets/steve.png';
import thomasAvatar from '../../../assets/thomas.png';

import css from './WelcomePopup.less';

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

	return (<Cell>{Component}</Cell>);
};

const WelcomePanel = Skinnable({defaultSkin: 'carbon'}, Panel);

import {fadeIn, fadeOut, reverse} from '@enact/ui/ViewManager/arrange';

const Arranger = {
	enter: reverse(fadeIn),
	leave: reverse(fadeOut)
};


const imageItemCss = {
	gridListImageItem: css.avatar,
	caption: css.caption,
	image: css.image
};

const UserSelectionAvatar = kind({
	name: 'UserSelectionAvatar',

	handlers: {
		onSelectUser: (ev, {index, onSelectUser}) => {
			onSelectUser({selected: index});
		}
	},

	computed: {
		source: ({index}) => {
			switch (index) {
				case 0:
					return steveAvatar;
				case 1:
					return thomasAvatar;
			}
		},
		style: ({style, index}) => ({
			...style,
			'--user-index': index
		})
	},

	render: ({children, onSelectUser, source, style}) => {
		return (
			<GridListImageItem
				css={imageItemCss}
				caption={children}
				onClick={onSelectUser}
				source={source}
				style={style}
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
				<Row align="center space-evenly" className="enact-fit">
					{users.map((user, index) => (
						<UserSelectionAvatar index={index} onSelectUser={onSelectUser}>
							{user}
						</UserSelectionAvatar>
					))}
				</Row>
			</WelcomePanel>
		);
	}
});

const WelcomePopupBase = kind({
	name: 'WelcomePopup',

	propTypes: {
		components: PropTypes.object,
		index: PropTypes.number,
		onCancelSelect: PropTypes.func,
		onClose: PropTypes.func,
		onSelectUser: PropTypes.func,
		onSendVideo: PropTypes.func,
		onSetDestination: PropTypes.func,
		onShowWelcome: PropTypes.func,
		positions: PropTypes.array,
		profileName: PropTypes.string,
		proposedDestination: propTypeLatLonList,
		setDestination: PropTypes.func,  // Incoming function from AppStateConnect
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
			(ev, {proposedDestination, setDestination}) => {
				if (proposedDestination) {
					setDestination({destination: proposedDestination});
				}
				return true;
			},
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
		onSetDestination,
		positions,
		profileName,
		proposedDestination,
		small1Component: Small1Component,
		small2Component: Small2Component,
		usersList,
		...rest
	}) => {
		delete rest.components;
		delete rest.onClose;
		delete rest.onSendVideo;
		delete rest.onShowWelcome;
		delete rest.updateUser;
		delete rest.setDestination;
		delete rest.userId;

		return (
			<FullscreenPopup {...rest}>
				<Panels arranger={Arranger} index={index} enteringProp="hideChildren" onTransition={handleTransition}>
					<UserSelectionPanel users={usersList} onSelectUser={onSelectUser} />
					<WelcomePanel />
					<Panel>
						<Column>
							<Cell size="20%">
								<Row align="center">
									<Cell component={Button} icon="user" onClick={onCancelSelect} shrink />
									<Cell component={Item} spotlightDisabled>
										Hi {profileName}!
									</Cell>
									<Cell component={Button} icon="arrowsmallright" onClick={handleClose} shrink />
								</Row>
							</Cell>
							<Cell>
								<Row className={css.bottomRow}>
									<Cell size="25%">
										<DestinationList component={Button} onSetDestination={onSetDestination} positions={positions} title="Top Locations" />
									</Cell>
									<Cell component={MapCore} proposedDestination={proposedDestination} size="40%" />
									<Cell size="35%">
										<Column>
											{Small1Component}
											{Small2Component}
										</Column>
									</Cell>
								</Row>
							</Cell>
						</Column>
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
				positions: [
					{lat: 37.788818, lon: -122.404568}, // LG office
					{lat: 37.791356, lon: -122.400823}, // Blue Bottle Coffee
					{lat: 37.788988, lon: -122.401076},
					{lat: 37.7908574786, lon: -122.399391029},
					{lat: 37.786116, lon: -122.402140}
				],
				destination: null,
				selected: null
			};
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.open && !nextProps.open) {
				this.setState({index: 0});
			}
		}

		handleSetDestination = (ev) => {
			const index = ev.currentTarget.dataset.index;
			this.setState(({positions}) => ({destination: [positions[index]]}));
		}

		handleSelectUser = ({selected}) => {
			this.setState({index: 1, selected});
		}

		handleCancelSelect = () => {
			this.setState({index: 0});
		}

		handleShowWelcome = () => {
			this.setState(({index}) => index === 1 ? {index: ++index} : null);
		}

		render () {
			const {destination, index, positions} = this.state;

			return (
				<Wrapped
					{...this.props}
					index={index}
					onSelectUser={this.handleSelectUser}
					onCancelSelect={this.handleCancelSelect}
					onSetDestination={this.handleSetDestination}
					onShowWelcome={this.handleShowWelcome}
					positions={positions}
					proposedDestination={destination}
					selected={this.state.selected}
				/>
			);
		}
	};
});

const AppContextDecorator = AppContextConnect(({getUserNames, updateAppState, userId, userSettings}) => {
	return {
		components: (userSettings.components && {...userSettings.components.welcome}),
		profileName: userSettings.name,
		setDestination: ({destination}) => {
			updateAppState((state) => {
				state.navigation.destination = destination;
			});
		},
		updateUser: ({selected}) => {
			updateAppState((state) => {
				state.userId = selected + 1;
			});
		},
		userId,
		usersList: getUserNames()
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
