import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './CompactHeader.less';

const CompactHeader = kind({
	name: 'CompactHeader',

	propTypes: {
		children: PropTypes.node,
		noExpandButton: PropTypes.bool,
		onExpand: PropTypes.func,
		view: PropTypes.string
	},

	defaultProps: {
		noExpandButton: false
	},

	styles: {
		css,
		className: 'compactHeader'
	},

	handlers: {
		onExpand: handle(
			adaptEvent((ev, {view}) => ({view}), forward('onExpand'))
		)
	},

	render: ({children, onExpand, noExpandButton, ...rest}) => (
		<Divider {...rest}>
			{children && <span className={css.title}>{children}</span>}
			{!noExpandButton ? (
				<Button
					alt="Fullscreen"
					className={css.btn}
					icon="expand"
					onClick={onExpand}
					size="tiny"
					type="sized"
				/>
			) : null}
		</Divider>
	)
});

export default CompactHeader;
