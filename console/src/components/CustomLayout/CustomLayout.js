import kind from '@enact/core/kind';
import {Layout, Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import React from 'react';

import Rearrangeable from '../Rearrangeable';
import DropZone, {Draggable} from '../DropZone';

import css from './CustomLayout.less';

const allSlotNames = ['children', 'footer', 'header', 'left', 'right'];

const DroppableCell = Draggable(Cell);

const CustomLayoutBase = kind({
	name: 'CustomLayout',

	propTypes: {
		arrangement: PropTypes.object,
		arranging: PropTypes.bool,
		children: PropTypes.node,
		footer: PropTypes.node,
		header: PropTypes.node,
		left: PropTypes.node,
		right: PropTypes.node
	},

	styles: {
		css,
		// className: 'customLayout'
		className: 'customLayout debug layout drag'
	},

	render: ({arrangement, arranging, header, left, children, right, footer, ...rest}) => {
		return (
			<Layout {...rest} orientation="vertical">
				{header || arranging ? <DroppableCell size="25%" className={css.header} arrangement={arrangement} name="header">{header}</DroppableCell> : null}
				<Cell>
					<Layout className={css.bodyRow}>
						{left || arranging ? <DroppableCell size="30%" className={css.left}  arrangement={arrangement} name="left">{left}</DroppableCell> : null}
						<DroppableCell className={css.body}  arrangement={arrangement} name="children">{children}</DroppableCell>
						{right || arranging ? <DroppableCell size="30%" className={css.right} arrangement={arrangement} name="right">{right}</DroppableCell> : null}
					</Layout>
				</Cell>
				{footer || arranging ? <DroppableCell size="25%" className={css.footer} arrangement={arrangement} name="footer">{footer}</DroppableCell> : null}
			</Layout>
		);
	}
});

const CustomLayout = DropZone(
	// Don't provide the "children" slot to Slottable
	Slottable({slots: allSlotNames.filter(slot => slot !== 'children')},
		Rearrangeable({slots: allSlotNames},
			CustomLayoutBase
		)
	)
);

export default CustomLayout;
export {
	CustomLayout
};
