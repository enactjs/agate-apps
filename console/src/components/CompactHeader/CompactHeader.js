import Divider from '@enact/agate/Divider';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@enact/agate/IconButton';

import css from './CompactHeader.module.less';

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
		<Row component={Divider} spacing="large" {...rest}>
			{children && <Cell className={css.title}>{children}</Cell>}
			{!noExpandButton ? (
				<Cell shrink>
					<IconButton
						className={css.btn}
						size="smallest"
						alt="Fullscreen"
						onClick={onExpand}
					>
						expand
					</IconButton>
				</Cell>
			) : null}
		</Row>
	)
});

export default CompactHeader;
