import Button from '@enact/agate/Button';
import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import PropTypes from 'prop-types';
import RadioItem from '@enact/agate/RadioItem';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import UserAvatar from '../UserAvatar';

import css from './UserSelectionPopup.less';

const UserRadioItem = kind({
	name: 'UserRadioItem',
	computed: {
		userAvatarClassName: ({selected}) => selected ? `${css.avatar} ${css.selected}` : css.avatar,
		userAvatarId: ({children}) => children === 'Laura' ? 0 : 1
	},
	render: ({onClick, userAvatarClassName, userAvatarId, ...rest}) => {
		return (
			<div className={css.userRadioItem}>
				<UserAvatar
					className={userAvatarClassName}
					userId={userAvatarId}
					onClick={onClick}
				/>
				<RadioItem {...rest} style={{flex: '1'}} onClick={onClick} />
			</div>
		);
	}
});

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
			onResetPosition({x: 52880.8698406219, y: 4182781.1160838, z: -2.3562});
			onResetCopilot();
		},
		onResetPosition: (ev, {onResetPosition}) => {
			onResetPosition({x: 52880.8698406219, y: 4182781.1160838, z: -2.3562});
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
				closeButton
				{...rest}
			>
				<title>User Selection</title>

				<Group
					childComponent={UserRadioItem}
					defaultSelected={userId - 1}
					onSelect={updateUser}
					select="radio"
					selectedProp="selected"
				>
					{usersList}
				</Group>

				<buttons>
					<Button className={css.button} onClick={resetUserSettings}>Reset Current User</Button>
					<Button className={css.button} onClick={onResetAll}>Restart Demo</Button>
					<Button className={css.button} onClick={onResetPosition}>Reset Position</Button>
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
