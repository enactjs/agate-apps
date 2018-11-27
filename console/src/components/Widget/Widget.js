import kind from '@enact/core/kind';
import Layout, {Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import CompactHeader from '../CompactHeader';

import css from './Widget.less';

const Widget = kind({
	name: 'Widget',

	propTypes: {
		header: PropTypes.string,
		noHeader: PropTypes.string,
		onExpand: PropTypes.func,
		view: PropTypes.string
	},

	styles: {
		css,
		className: 'widget'
	},

	render: ({children, header, onExpand, noHeader, view, ...rest}) => {
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

export default Widget;
export {
	Widget
};
