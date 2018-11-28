import {ResponsiveBox} from '@enact/agate/DropManager';
import kind from '@enact/core/kind';
import Layout, {Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import CompactHeader from '../CompactHeader';

import css from './Widget.less';

const WidgetBase = kind({
	name: 'Widget',

	propTypes: {
		containerShape: PropTypes.object,
		header: PropTypes.string,
		large: PropTypes.node,
		medium: PropTypes.node,
		noHeader: PropTypes.string,
		onExpand: PropTypes.func,
		small: PropTypes.node,
		view: PropTypes.string
	},

	styles: {
		css,
		className: 'widget'
	},

	computed: {
		children: ({children, containerShape, large, medium, small}) => {
			const size = containerShape && containerShape.size && containerShape.size;

			switch (size) {
				case 'large':
					return large || medium || small || children;
				case 'medium':
					return medium || small || large || children;
				case 'small':
					return small || medium || large || children;
				default:
					return children || small || medium || large;
			}
		}
	},

	render: ({children, header, onExpand, noHeader, view, ...rest}) => {
		delete rest.containerShape;
		delete rest.large;
		delete rest.medium;
		delete rest.small;

		return (
			<Layout {...rest} orientation="vertical" align="center center">
				{!noHeader ? (
					<Cell shrink component={CompactHeader} onExpand={onExpand} view={view}>
						{header}
					</Cell>
				) : null}
				{children}
			</Layout>
		);
	}
});

// eslint-disable-next-line no-unused-vars
const WidgetDecorator = compose(
	Slottable({slots: ['small', 'medium', 'large']}),
	ResponsiveBox
);

const Widget = WidgetDecorator(WidgetBase);

export default Widget;
export {
	Widget,
	WidgetBase,
	WidgetDecorator
};
