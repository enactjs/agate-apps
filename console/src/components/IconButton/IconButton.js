import Button from '@enact/agate/Button';
import AgateIcon from '@enact/agate/Icon';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import componentCss from './IconButton.less';

const Icon = kind({
	name: 'Icon',
	propTypes: {
		size: PropTypes.oneOf(['small', 'smallest'])
	},
	styles: {
		css: componentCss,
		className: 'icon'
	},
	computed: {
		className: ({size, styler}) => styler.append(size),
		small: ({size}) => size === 'small'
	},
	render: (props) => {
		delete props.size;

		return (
			<AgateIcon {...props} />
		);
	}
});

const IconButton = kind({
	name: 'IconButton',
	propTypes: {
		css: PropTypes.object,
		size: PropTypes.oneOf(['small', 'smallest'])
	},
	styles: {
		css: componentCss
	},
	computed: {
		className: ({size, styler}) => styler.append(size),
		icon: ({children, css, icon, size}) => {
			let value = children;

			if (typeof icon === 'string') {
				value = icon;
			}

			return (
				<Icon size={size} className={css.icon}>{value}</Icon>
			);
		},
		small: ({size}) => size === 'small'
	},
	render: (props) => {
		delete props.children;
		delete props.size;

		return (
			<Button {...props} css={props.css} />
		);
	}
});

export default IconButton;
export {
	IconButton
};
