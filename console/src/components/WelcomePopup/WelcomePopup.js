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
		selectUserAndContinue: handle(
			forward('updateUser'),
			forward('onNextView')
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
		index,
		onPreviousView,
		onSendVideo,
		onSetDestination,
		selectUserAndContinue,
		positions,
		profileName,
		proposedDestination,
		usersList,
		...rest
	}) => {
		delete rest.onClose;
		delete rest.onNextView;
		delete rest.updateUser;
		delete rest.setDestination;
		delete rest.userId;

		return (
			<FullscreenPopup {...rest}>
				<Panels index={index}>
					<Panel>
						<Column align="stretch center">
							<Cell component={Divider} startSection shrink>User Selection</Cell>
							<Cell shrink>
								<Row
									component={Group}
									childComponent={Cell}
									itemProps={{component: LabeledIconButton, shrink: true, icon: 'user'}}
									onSelect={selectUserAndContinue}
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

		constructor (props) {
			super(props);
			this.state = {
				positions: [
					{lat: 37.788818, lon: -122.404568}, // LG office
					{lat: 37.791356, lon: -122.400823}, // Blue Bottle Coffee
					{lat: 37.788988, lon: -122.401076},
					{lat: 37.7908574786, lon: -122.399391029},
					{lat: 37.786116, lon: -122.402140}
				],
				destination: null
			};
		}

		handleSetDestination = (ev) => {
			const index = ev.currentTarget.dataset.index;
			this.setState(({positions}) => ({destination: [positions[index]]}));
		}

		render () {
			const {destination, positions} = this.state;
			return (
				<Wrapped
					{...this.props}
					onSetDestination={this.handleSetDestination}
					positions={positions}
					proposedDestination={destination}
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
