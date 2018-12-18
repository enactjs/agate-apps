import kind from '@enact/core/kind';
// import hoc from '@enact/core/hoc';
import Group from '@enact/ui/Group';
import Popup from '@enact/agate/Popup';
import Button from '@enact/agate/Button';
import Item from '@enact/agate/Item';
// import {Layout, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';

import css from './UserSelectionPopup.less';


const UserSelectionPopupBase = kind({
	name: 'UserSelectionPopup',

	propTypes: {
		onResetAll: PropTypes.func.isRequired,
		onResetCopilot: PropTypes.func.isRequired,
		onResetPosition: PropTypes.func.isRequired,
		resetAll: PropTypes.func.isRequired,
		resetPosition: PropTypes.func.isRequired,
		resetUserSettings: PropTypes.func.isRequired,
		updateAppState: PropTypes.func.isRequired,
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
		onResetAll: (ev, {onResetAll, resetAll, onResetCopilot, onResetPosition}) => {
			onResetAll();
			resetAll();
			// This is being hard coded for now because it's the default reset for the simulator.
			onResetPosition({x:52880.8698406219, y: 4182781.1160838, z: -2.3562});
			onResetCopilot();
		},
		onResetPosition: (ev, {onResetPosition}) => {
			onResetPosition({x:52880.8698406219, y: 4182781.1160838, z: -2.3562});
		},
		updateUser: ({selected}, {updateAppState}) => {
			updateAppState((state) => {
				state.userId = selected + 1;
			});
		}
	},

	render: ({userId, usersList, updateUser, resetUserSettings, onResetPosition, onResetAll, ...rest}) => {
		delete rest.onResetCopilot;
		delete rest.resetAll;
		delete rest.resetPosition;
		delete rest.updateAppState;
		return (
			<Popup
				// onClose={onTogglePopup}
				// open={showPopup}
				closeButton
				{...rest}
			>
				<title>User Selection</title>

				<Group
					childComponent={Item}
					// itemProps={{
					// 	inline: boolean('ItemProps-Inline', Group)
					// }}
					select="radio"
					selectedProp="selected"
					defaultSelected={userId - 1}
					onSelect={updateUser}
				>
					{usersList}
				</Group>

				<buttons>
					<Button onClick={resetUserSettings}>Reset Current User</Button>
					<Button onClick={onResetAll}>Start Demo</Button>
					<Button onClick={onResetPosition}>Reset Position</Button>
				</buttons>
			</Popup>
		);
	}
});

const UserSelectionPopup = AppContextConnect(({userId, resetUserSettings, resetAll, usersList, updateAppState}) => ({
	usersList,
	userId,
	resetUserSettings,
	resetAll,
	updateAppState
}))(UserSelectionPopupBase);


export default UserSelectionPopup;
export {
	UserSelectionPopup,
	UserSelectionPopupBase
};

