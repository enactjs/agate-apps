import Button from '@enact/agate/Button';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Column, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import UserSelectionAvatar from '../UserSelectionAvatar';

import css from './UserSelectionPopup.less';

const UserSelectionPopupBase = kind({
	name: 'UserSelectionPopup',

	propTypes: {
		resetAll: PropTypes.func.isRequired,
		resetPosition: PropTypes.func.isRequired,
		resetUserSettings: PropTypes.func.isRequired,
		updateUser: PropTypes.func.isRequired,
		userId: PropTypes.number
	},

	defaultProps: {
		userId: 1
	},

	styles: {
		css,
		className: 'userSelectionPopup'
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

	handlers: {
		onSelectUser: handle(
			forward('onSelectUser'),
			forward('onClose')
		),
		onResetAll: (ev, {onResetAll, resetAll, resetPosition}) => {
			onResetAll();
			resetAll();
			// This is being hard coded for now because it's the default reset for the simulator.
			resetPosition({x:52880.8698406219, y: 4182781.1160838, z: -2.3562});
		}
	},

	render: ({usersList, resetUserSettings, onResetAll, onSelectUser, ...rest}) => {
		delete rest.resetAll;
		delete rest.resetPosition;

		return (
			<FullscreenPopup {...rest}>
				<Column align="normal space-between" className="enact-fit">
					<Row align="center space-evenly">
						{usersList.map((user, index) => (
							<UserSelectionAvatar index={index} onSelectUser={onSelectUser}>
								{user}
							</UserSelectionAvatar>
						))}
					</Row>

					<Row align="center space-evenly">
						<Button onTap={resetUserSettings}>Reset Current User</Button>
						<Button onTap={onResetAll}>Start Demo</Button>
					</Row>
				</Column>
			</FullscreenPopup>
		);
	}
});

const UserSelectionPopup = AppContextConnect(({resetUserSettings, resetAll, getUserNames, updateAppState}) => ({
	usersList: getUserNames(),
	resetUserSettings,
	resetAll,
	onSelectUser: ({selected}) => {
		updateAppState((state) => {
			state.userId = selected + 1;
		});
	}
}))(UserSelectionPopupBase);


export default UserSelectionPopup;
export {
	UserSelectionPopup,
	UserSelectionPopupBase
};

