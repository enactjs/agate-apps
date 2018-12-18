import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React from 'react';

import lauraAvatar from '../../../assets/laura.png';
import thomasAvatar from '../../../assets/thomas.png';

import componentCss from './UserAvatar.less';

const userAvatars = [lauraAvatar, thomasAvatar];

const UserAvatarBase = kind({
	name: 'UserAvatar',

	propTypes: {
		userId: PropTypes.number.isRequired,
		css: PropTypes.object,
		size: PropTypes.oneOf(['small', 'medium', 'large']) // Small, Large, and null (normal) are supported
	},

	defaultProps: {
		size: 'medium'
	},

	styles: {
		css: componentCss,
		className: 'userAvatar',
		publicClassNames: true
	},

	handlers: {
		onClick: handle(
			adaptEvent((ev, {userId}) => ({selected: userId}), forward('onClick'))
		)
	},

	computed: {
		className: ({size, styler}) => styler.append(size),
		source: ({userId}) => (userAvatars[userId] || 'none'),
		style: ({style, userId}) => ({
			...style,
			'--user-index': userId
		})
	},

	render: ({children, css, ...rest}) => {
		delete rest.userId;
		delete rest.size;
		return (
			<GridListImageItem
				{...rest}
				css={css}
				caption={children}
			/>
		);
	}
});

export default UserAvatarBase;
export {
	UserAvatarBase as UserAvatar,
	UserAvatarBase
};
