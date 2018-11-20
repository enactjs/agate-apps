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
		className: ({css, smallest, styler}) => {
			return styler.append(smallest ? css.smallest : '');
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
		className: ({css, smallest, styler}) => {
			return styler.append(smallest ? css.smallest : '');
		}
	},
	render: ({children, css, icon, smallest, ...rest}) => {
		return (
			<Button
				css={css}
				icon={
					<Icon
						small={rest.small}
						smallest={smallest}
					>
						{icon}
					</Icon>
				}
				{...rest}
			/>
		);
	}
});

export default IconButton;
export {IconButton};
