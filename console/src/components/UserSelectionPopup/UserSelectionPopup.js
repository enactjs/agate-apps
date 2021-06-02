import Button from '@enact/agate/Button';
import Group from '@enact/ui/Group';
import {Row, Cell} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import PropTypes from 'prop-types';
import Item from '@enact/agate/Item';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import UserAvatar from '../UserAvatar';

import css from './UserSelectionPopup.module.less';

const UserItem = kind({
	name: 'UserItem',
	propTypes: {
		onClick: PropTypes.func,
		selected: PropTypes.bool,
		userId: PropTypes.number
	},
	styles: {
		css,
		className: 'userItem'
	},
	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},
	render: ({children, userId, ...rest}) => {
		delete rest.selected;
		return (
			<Item {...rest}>
				<UserAvatar
					className={css.avatar}
					css={css}
					userId={userId - 1}
				/>
				<div className={css.content}>
					{children}
				</div>
			</Item>
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
		resetUserSettings: PropTypes.func.isRequired,
		updateAppState: PropTypes.func.isRequired,
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
			for (const userId in usersList) {
				users.push({key: ('user' + userId), userId: parseInt(userId), children: usersList[userId]});
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
		delete rest.updateAppState;
		return (
			<Popup
				closeButton
				{...rest}
			>
				<title>User Selection</title>

				<Group
					childComponent={UserItem}
					defaultSelected={userId - 1}
					onSelect={updateUser}
					select="radio"
					selectedProp="selected"
				>
					{usersList}
				</Group>

				<buttons>
					<Row align="center space-around">
						<Cell shrink component={Button} size="small" className={css.button} onClick={resetUserSettings}>Reset Current User</Cell>
						<Cell shrink component={Button} size="small" className={css.button} onClick={onResetAll}>Restart Demo</Cell>
						<Cell shrink component={Button} size="small" className={css.button} onClick={onResetPosition}>Reset Position</Cell>
					</Row>
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
