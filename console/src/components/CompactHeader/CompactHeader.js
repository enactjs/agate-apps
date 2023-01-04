import Heading from '@enact/agate/Heading';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';

import Button from '@enact/agate/Button';

import css from './CompactHeader.module.less';

const TitleHeading = kind({
	name: 'TitleHeading',

	render ({...rest}) {
		return (<Heading marqueeDisabled {...rest} />);
	}
});


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
		<Row component={TitleHeading} spacing="large" {...rest}>
			{children && <Cell className={css.title}>{children}</Cell>}
			{!noExpandButton ? (
				<Cell shrink>
					<Button
						className={css.btn}
						size="small"
						alt="Fullscreen"
						onClick={onExpand}
						icon="expand"
					/>
				</Cell>
			) : null}
		</Row>
	)
});

export default CompactHeader;
