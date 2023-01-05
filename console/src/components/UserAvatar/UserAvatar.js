import ImageItem from '@enact/agate/ImageItem';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import lauraAvatar from '../../../assets/laura.png';
import thomasAvatar from '../../../assets/thomas.png';

import componentCss from './UserAvatar.module.less';

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
		src: ({userId}) => (userAvatars[userId] || 'none'),
		style: ({style, userId}) => ({
			...style,
			'--user-index': userId
		})
	},

	render: ({children, css, ...rest}) => {
		delete rest.userId;
		delete rest.size;
		return (
			<ImageItem
				{...rest}
				css={css}
			>
				{children}
			</ImageItem>
		);
	}
});

export default UserAvatarBase;
export {
	UserAvatarBase as UserAvatar,
	UserAvatarBase
};
