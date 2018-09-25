import kind from '@enact/core/kind';
// import hoc from '@enact/core/hoc';
// import {renameProps, renameProp} from 'recompose';
import {Layout, Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import React from 'react';

import DropZone, {Draggable} from '../DropZone';

import css from './CustomLayout.less';

const allSlotNames = ['children', 'footer', 'header', 'left', 'right'];

const propRemapper = (props) => {
	if (!props.arrangement) return props;

	const origRest = {...props};

	allSlotNames.forEach(prop => {
		if (props.arrangement[prop] && props.arrangement[prop] !== prop) {
			// If there is a new destination for a prop, assign it there... sourceProp -> destinationProp
			props[prop] = origRest[props.arrangement[prop]];
		}
	});
	return props;
};

// const propRemapper = (props) => {
// 	const origRest = {...props};
// 	allSlotNames.forEach(slot => {
// 		if (props.arrangement && props.arrangement[slot] && props.arrangement[slot] !== slot) {
// 			// If there is a new destination for a slot, assign it there... sourceSlot -> destinationSlot
// 			props[slot] = origRest[props.arrangement[slot]];
// 		// } else {
// 		// 	// ...if not, put it where it would naturally fall: sourceSlot == destinationSlot
// 		// 	slots[slot] = origRest[slot];
// 		}
// 	});
// 	return props;
// 	// Clean up named slots
// 	// allSlotNames.forEach(slot => delete rest[slot]);
// };

const DroppableCell = Draggable(Cell);

const CustomLayoutBase = kind({
	name: 'CustomLayout',

	propTypes: {
		// date: PropTypes.object.isRequired
		// orientation: PropTypes.string
		arrangement: PropTypes.object,
		children: PropTypes.node,
		footer: PropTypes.node,
		header: PropTypes.node,
		left: PropTypes.node,
		right: PropTypes.node
	},

	// defaultProps: {
	// 	orientation: 'vertical'
	// },

	styles: {
		css,
		className: 'customLayout layout debug'
	},

	// computed: {
	// 	slots: ({children}) => {
	// 		return (children instanceof Array ? children : [children]);
	// 	}
	// },

	// render: ({arrangement, ...rest}) => {
	// 	const slots = [];
	// 	allSlotNames.forEach(slot => {
	// 		if (arrangement && arrangement[slot] && arrangement[slot] !== slot) {
	// 			// If there is a new destination for a slot, assign it there... sourceSlot -> destinationSlot
	// 			slots[slot] = rest[arrangement[slot]];
	// 		} else {
	// 			// ...if not, put it where it would naturally fall: sourceSlot == destinationSlot
	// 			slots[slot] = rest[slot];
	// 		}
	// 	});
	// 	// Clean up named slots
	// 	allSlotNames.forEach(slot => delete rest[slot]);

	render: (props) => {
		const {header, left, children, right, footer, ...rest} = propRemapper(props);
		// const {header, left, children, right, footer, ...rest} = props;

		// const renamed = renameProps({header: 'left'}, props);

		// console.log('CustomLayout arrangement:', rest.arrangement);
		delete rest.arrangement;

		return (
			<Layout {...rest} orientation="vertical">
				{header ? <DroppableCell size="15%" className={css.header} data-slot="header">{header}</DroppableCell> : null}
				<Cell>
					<Layout className={css.bodyRow}>
						{left ? <DroppableCell size="20%" className={css.left} data-slot="left">{left}</DroppableCell> : null}
						<DroppableCell className={css.body} data-slot="children">{children}</DroppableCell>
						{right ? <DroppableCell size="20%" className={css.right} data-slot="right">{right}</DroppableCell> : null}
					</Layout>
				</Cell>
				{footer ? <DroppableCell size="15%" className={css.footer} data-slot="footer">{footer}</DroppableCell> : null}
			</Layout>
		);
	}
});
// const remappedProps = renameProps({header: 'left'});

const CustomLayout = DropZone(
	Slottable({slots: ['header', 'footer', 'left', 'right']},
	// remappedProps(
	// renameProp('footer', 'right',
		CustomLayoutBase
	// )
	// )
	)
);

export default CustomLayout;
