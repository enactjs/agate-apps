import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../IconButton';

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

	render: ({children, onExpand, noExpandButton, ...rest}) => (
		<Divider {...rest}>
			<span className={css.title}>{children}</span>
			{!noExpandButton ? (
				<IconButton
					className={css.btn}
					size="smallest"
					alt="Fullscreen"
					icon="fullscreen"
					onKeyUp={onExpand}
					onClick={onExpand}
				/>
			) : null}
		</Divider>
	)
});

export default CompactHeader;
