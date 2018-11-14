import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import {Item} from '@enact/agate/Item';
import {Panel, Panels} from '@enact/agate/Panels';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import {handle, forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Column, Row, Cell} from '@enact/ui/Layout';
import Group from '@enact/ui/Group';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import CompactMap from '../CompactMap';
import CompactMultimedia from '../CompactMultimedia';
import CompactWeather from '../CompactWeather';

import css from './WelcomePopup.less';

const WelcomePopupBase = kind({
	name: 'WelcomePopup',

	propTypes: {
		index: PropTypes.number,
		onClose: PropTypes.func,
		onNextView: PropTypes.func,
		onPreviousView: PropTypes.func,
		onSendVideo: PropTypes.func,
		profileName: PropTypes.string,
		resetAll: PropTypes.func,
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
		selectUserAndContinue: handle(
			forward('updateUser'),
			forward('onNextView')
		)
	},

	computed: {
		usersList: ({resetAll, usersList}) => {
			// If there are no users in the list, stamp some out and prepare the system.
			if (Object.keys(usersList).length <= 0) resetAll();

			const users = [];
			for (const user in usersList) {
				users.push(usersList[user]);
			}
			return users;
		}
	},

	render: ({index, onClose, onPreviousView, onSendVideo, selectUserAndContinue, profileName, usersList, ...rest}) => {
		delete rest.onNextView;
		delete rest.resetAll;
		delete rest.updateUser;
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
									<Cell component={Button} icon="arrowsmallright" onClick={onClose} shrink />
								</Row>
							</Cell>
							<Cell>
								<Row className={css.bottomRow}>
									<Cell size="25%">
										Destinations
									</Cell>
									<Cell component={CompactMap} size="40%" />
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

const WelcomePopup = AppContextConnect(({getUserNames, resetAll, updateAppState, userId, userSettings}) => ({
	resetAll,
	usersList: getUserNames(),
	profileName: userSettings.name,
	updateUser: ({selected}) => {
		updateAppState((state) => {
			state.userId = selected + 1;
		});
	},
	userId
}))(WelcomePopupBase);

export default WelcomePopup;
export {
	WelcomePopup,
	WelcomePopupBase
};

