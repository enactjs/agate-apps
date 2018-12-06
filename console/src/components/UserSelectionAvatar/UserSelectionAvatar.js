import GridListImageItem from '@enact/agate/GridListImageItem';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import steveAvatar from '../../../assets/steve.png';
import thomasAvatar from '../../../assets/thomas.png';

import css from './UserSelectionAvatar.less';

const userAvatars = [steveAvatar, thomasAvatar];

const UserSelectionAvatar = kind({
	name: 'UserSelectionAvatar',

	propTypes: {
		index: PropTypes.number,
		onSelectUser: PropTypes.func
	},

	handlers: {
		onClick: handle(
			adaptEvent((ev, {index}) => ({selected: index}), forward('onSelectUser'))
		)
	},

	computed: {
		source: ({index}) => (userAvatars[index] || 'none'),
		style: ({style, index}) => ({
			...style,
			'--user-index': index
		})
	},

	render: ({children, ...rest}) => {
		delete rest.index;
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
export {
	UserSelectionAvatar
};
