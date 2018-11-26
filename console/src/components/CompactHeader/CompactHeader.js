import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';

import css from './CompactHeader.less';

const CompactHeader = kind({
	name: 'CompactHeader',

	propTypes: {
		children: PropTypes.node,
		noExpandButton: PropTypes.bool,
		onExpand: PropTypes.func,
		view: PropTypes.string
	},

	styles: {
		css,
		className: 'compactHeader'
	},

	defaultProps: {
		noExpandButton: false
	},

	render: ({children, className, onExpand, noExpandButton, ...rest}) => (
		<Divider css={css} className={className} {...rest}>
			<span className={css.title}>{children}</span>
			{
				!noExpandButton &&
				<Button className={css.btn} small alt="Fullscreen" icon="fullscreen" onKeyUp={onExpand} onClick={onExpand} />
			}
		</Divider>
	)
});

export default CompactHeader;
