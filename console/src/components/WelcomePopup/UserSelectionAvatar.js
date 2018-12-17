import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import React from 'react';

import lauraAvatar from '../../../assets/laura.png';
import thomasAvatar from '../../../assets/thomas.png';

import css from './WelcomePopup.less';


const userAvatars = [lauraAvatar, thomasAvatar];

const UserSelectionAvatar = kind({
	name: 'UserSelectionAvatar',

	handlers: {
		onClick: (ev, {index, onSelectUser}) => {
			onSelectUser({selected: index});
		}
	},

	computed: {
		source: ({index}) => (userAvatars[index] || 'none'),
		style: ({style, index}) => ({
			...style,
			'--user-index': index
		})
	},

	render: ({children, ...rest}) => {
		delete rest.onSelectUser;
		return (
			<GridListImageItem
				{...rest}
				css={css}
				caption={children}
			/>
		);
	}
});

export default UserSelectionAvatar;
