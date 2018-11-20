import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import Button from '@enact/agate/Button';

import css from './CompactHeader.less';
import {getPanelIndexOf} from '../../App';

const CompactHeader = kind({
	name: 'CompactHeader',

	propTypes: {
		children: PropTypes.node,
		noExpandButton: PropTypes.bool,
		onExpand: PropTypes.func
	},

	styles: {
		css,
		className: 'compactHeader',
		publicClassNames: true
	},

	defaultProps: {
		noExpandButton: false
	},

	handlers: {
		onTabChange: (ev, {onExpand}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onExpand({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({children, className, onExpand, size = 180, onTabChange, style, noExpandButton, ...rest}) => (
		<div size={size} className={className} style={style} {...rest}>
			{children}
			{
				!noExpandButton &&
				<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('weather')} onSelect={onExpand} onKeyUp={onTabChange} onClick={onTabChange} />
			}
		</div>
	)
});

export default CompactHeader;
