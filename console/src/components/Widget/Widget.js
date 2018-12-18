import {ResponsiveBox} from '@enact/agate/DropManager';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import kind from '@enact/core/kind';
import Layout, {Cell, Row} from '@enact/ui/Layout';
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
		description: PropTypes.string,
		full: PropTypes.node,
		icon: PropTypes.string,
		large: PropTypes.node,
		medium: PropTypes.node,
		noHeader: PropTypes.bool,
		onExpand: PropTypes.func,
		small: PropTypes.node,
		title: PropTypes.string,
		view: PropTypes.string
	},

	styles: {
		css,
		className: 'widget'
	},

	computed: {
		children: ({children, containerShape, full, large, medium, small, title}) => {
			const size = containerShape && containerShape.size && containerShape.size.relative;

			switch (size) {
				case 'list':
					return title || 'Widget';
				case 'full':
					return full || large || medium || small || children;
				case 'large':
					return large || medium || small || full || children;
				case 'medium':
					return medium || small || large || full || children;
				case 'small':
					return small || medium || large || full || children;
				default:
					return children || small || medium || large || full;
			}
		}
	},

	render: ({children, containerShape, icon, onExpand, noExpandButton, noHeader, title, view, ...rest}) => {
		delete rest.containerShape;
		delete rest.description;
		delete rest.full;
		delete rest.large;
		delete rest.medium;
		delete rest.small;

		const relativeSize = (containerShape && containerShape.size && containerShape.size.relative);
		switch (relativeSize) {
			case 'list': return (
				<Row align="center">
					<Cell component={LabeledIconButton} css={css} icon={icon} shrink />
					<Cell>{title}</Cell>
				</Row>
			);
			default: return (
				<Layout {...rest} orientation="vertical" align="center center">
					{!noHeader ? (
						<Cell shrink component={CompactHeader} noExpandButton={noExpandButton} onExpand={onExpand} view={view}>
							{title}
						</Cell>
					) : null}
					{children}
				</Layout>
			);
		}
	}
});

// eslint-disable-next-line no-unused-vars
const WidgetDecorator = compose(
	Slottable({slots: ['small', 'medium', 'large', 'full']}),
	ResponsiveBox
);

const Widget = WidgetDecorator(WidgetBase);

export default Widget;
export {
	Widget,
	WidgetBase,
	WidgetDecorator
};
