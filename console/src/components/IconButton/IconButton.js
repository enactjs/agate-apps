import AgateIcon from '@enact/agate/Icon';
import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import React from 'react';

import componentCss from './IconButton.less';

const Icon = kind({
	name: 'Icon',
	styles: {
		css: componentCss,
		className: 'icon'
	},
	computed: {
		className: ({css, size, styler}) => {
			return styler.append(size && css[size]);
		}
	},
	render: (props) => {
		delete props.smallest;
		return (
			<AgateIcon {...props} />
		);
	}
});

const IconButton = kind({
	name: 'IconButton',
	styles: {
		css: componentCss
	},
	computed: {
		className: ({css, size, styler}) => {
			return styler.append(size && css[size]);
		},
		icon: ({children, css, icon, size, small}) => {
			let value = children;

			if (typeof icon === 'string') {
				value = icon;
			}

			return <Icon size={size} small={small} className={css.icon}>{value}</Icon>;
		}
	},
	render: ({css, small, ...rest}) => {
		delete rest.children;
		delete rest.size;
		return (
			<Button
				css={css}
				small={small}
				{...rest}
			/>
		);
	}
});

export default IconButton;
export {IconButton};
