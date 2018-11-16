import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import {Item} from '@enact/agate/Item';
import {Panel, Panels} from '@enact/agate/Panels';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import {handle, forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import {Column, Row, Cell} from '@enact/ui/Layout';
import Group from '@enact/ui/Group';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import CompactMultimedia from '../CompactMultimedia';
import CompactWeather from '../CompactWeather';
import DestinationList from '../DestinationList';
import MapCore from '../MapCore';
import {propTypeLatLonList} from '../../data/proptypes';

import css from './WelcomePopup.less';

const WelcomePopupBase = kind({
	name: 'WelcomePopup',

	propTypes: {
		index: PropTypes.number,
		onClose: PropTypes.func,
		onNextView: PropTypes.func,
		onPreviousView: PropTypes.func,
		onSendVideo: PropTypes.func,
		onSetDestination: PropTypes.func,
		onTransition: PropTypes.func,
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
			(ev, {index, selected, updateUser}) => {
				if (index === 1) {
					updateUser({selected});
				}
				return true;
			},
			forward('onTransition')
		)
	},

	computed: {
		usersList: ({usersList}) => {
			const users = [];
			for (const user in usersList) {
				users.push(usersList[user]);
			}
			return users;
		}
	},

	render: ({
		handleClose,
		handleTransition,
		index,
		onNextView,
		onPreviousView,
		onSendVideo,
		onSetDestination,
		positions,
		profileName,
		proposedDestination,
		usersList,
		...rest
	}) => {
		delete rest.onClose;
		delete rest.onTransition;
		delete rest.updateUser;
		delete rest.setDestination;
		delete rest.userId;

		return (
			<FullscreenPopup {...rest}>
				<Panels index={index} enteringProp="hideChildren" onTransition={handleTransition}>
					<Panel>
						<Column align="stretch center">
							<Cell component={Divider} startSection shrink>User Selection</Cell>
							<Cell shrink>
								<Row
									component={Group}
									childComponent={Cell}
									itemProps={{component: LabeledIconButton, shrink: true, icon: 'user'}}
									onSelect={onNextView}
									select="radio"
									selectedProp="selected"
									wrap
									align="start space-evenly"
								>
									{usersList}
								</Row>
							</Cell>
						</Column>
					</Panel>
					<Panel />
					<Panel>
						<Column>
							<Cell size="20%">
								<Row align="center">
									<Cell component={Button} icon="user" onClick={onPreviousView} shrink />
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
											<Cell shrink>
												<CompactWeather />
											</Cell>
											<Cell>
												<CompactMultimedia onSendVideo={onSendVideo} />
											</Cell>
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
			open: PropTypes.bool
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

		onNextView = ({selected}) => {
			this.setState((state) => ({index: ++state.index, selected}));
		}

		onPreviousView = () => {
			this.setState({index: 0});
		}

		onTransition = () => {
			this.setState(({index}) => index === 1 ? {index: ++index} : null);
		}

		render () {
			const {destination, index, positions} = this.state;
			return (
				<Wrapped
					{...this.props}
					index={index}
					onNextView={this.onNextView}
					onPreviousView={this.onPreviousView}
					onSetDestination={this.handleSetDestination}
					onTransition={this.onTransition}
					positions={positions}
					proposedDestination={destination}
					selected={this.state.selected}
				/>
			);
		}
	};
});

const WelcomePopup = AppContextConnect(({getUserNames, updateAppState, userId, userSettings}) => ({
	usersList: getUserNames(),
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
	userId
}))(WelcomePopupState(WelcomePopupBase));

export default WelcomePopup;
export {
	WelcomePopup,
	WelcomePopupBase
};
