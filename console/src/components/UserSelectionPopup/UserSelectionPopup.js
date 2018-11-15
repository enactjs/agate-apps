import kind from '@enact/core/kind';
// import hoc from '@enact/core/hoc';
import Group from '@enact/ui/Group';
import Popup from '@enact/agate/Popup';
import Button from '@enact/agate/Button';
import SwitchItem from '@enact/agate/SwitchItem';
// import {Layout, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';

import css from './UserSelectionPopup.less';


const UserSelectionPopupBase = kind({
	name: 'UserSelectionPopup',

	propTypes: {
		resetAll: PropTypes.func.isRequired,
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
		onResetAll: (ev, {onReset, resetAll}) => {
			onReset();
			resetAll();
		}
	},

	render: ({userId, usersList, updateUser, resetUserSettings, onResetAll, ...rest}) => (
		<Popup
			// onClose={onTogglePopup}
			// open={showPopup}
			closeButton
			{...rest}
		>
			<title>User Selection</title>

			<Group
				childComponent={SwitchItem}
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
				<Button onTap={resetUserSettings}>Reset Current User</Button>
				<Button
					onTap={onResetAll}
				>Start Demo</Button>
			</buttons>
		</Popup>
	)
});

const UserSelectionPopup = AppContextConnect(({userId, resetUserSettings, resetAll, getUserNames, updateAppState}) => ({
	usersList: getUserNames(),
	userId,
	resetUserSettings,
	resetAll,
	updateUser: ({selected}) => {
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

