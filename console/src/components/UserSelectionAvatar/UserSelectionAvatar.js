import GridListImageItem from '@enact/agate/GridListImageItem';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import steveAvatar from '../../../assets/steve.png';
import thomasAvatar from '../../../assets/thomas.png';

import css from './UserSelectionAvatar.less';

const UserSelectionAvatar = kind({
	name: 'UserSelectionAvatar',

	propTypes: {
		index: PropTypes.number,
		onSelectUser: PropTypes.func
	},

	styles: {
		css,
		className: 'avatar'
	},

	handlers: {
		onSelectUser: handle(
			adaptEvent((ev, {index}) => ({selected: index}), forward('onSelectUser'))
		)
	},

	computed: {
		source: ({index}) => {
			switch (index) {
				case 0:
					return steveAvatar;
				case 1:
					return thomasAvatar;
			}
		},
		style: ({style, index}) => ({
			...style,
			'--user-index': index
		})
	},

	render: ({children, onSelectUser, ...rest}) => {
		delete rest.index;

		return (
			<GridListImageItem
				{...rest}
				css={css}
				caption={children}
				onClick={onSelectUser}
			/>
		);
	}
});

export default UserSelectionAvatar;
export {
	UserSelectionAvatar
};
