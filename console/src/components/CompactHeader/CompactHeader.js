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
		isFor: PropTypes.string,
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
		onTabChange: (ev, {isFor, onExpand}) => {
			const tabIndex = getPanelIndexOf(isFor);
			if ((ev.keyCode === 13 || ev.type === 'click') && tabIndex) {
				onExpand({index: parseInt(tabIndex)});
			}
		}
	},

	render: ({children, className, onExpand, onTabChange, style, noExpandButton, ...rest}) => (
		<div className={className} style={style} {...rest}>
			<span className={css.title}>{children}</span>
			{
				!noExpandButton &&
				<Button className={css.btn} small alt="Fullscreen" icon="fullscreen" onKeyUp={onTabChange} onClick={onTabChange} />
			}
		</div>
	)
});

export default CompactHeader;
