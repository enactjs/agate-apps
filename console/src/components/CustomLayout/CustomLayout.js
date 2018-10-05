import kind from '@enact/core/kind';
import {Layout, Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import React from 'react';

import Rearrangeable from '../Rearrangeable';
import DropManager, {Draggable} from '@enact/agate/DropManager';

import css from './CustomLayout.less';

const allSlotNames = ['bottom', 'bottomLeft', 'bottomRight', 'children', 'top', 'topLeft', 'topRight', 'left', 'right'];

const DroppableCell = Draggable(Cell);

const CustomLayoutBase = kind({
	name: 'CustomLayout',

	propTypes: {
		arrangement: PropTypes.object,
		arranging: PropTypes.bool,
		bottom: PropTypes.node,
		bottomLeft: PropTypes.node,
		bottomRight: PropTypes.node,
		children: PropTypes.node,
		left: PropTypes.node,
		right: PropTypes.node,
		top: PropTypes.node,
		topLeft: PropTypes.node,
		topRight: PropTypes.node
	},

	styles: {
		css,
		className: 'customLayout'
		// className: 'customLayout debug layout'
		// className: 'customLayout debug layout drag'
	},

	render: ({arrangement, arranging, topLeft, top, topRight, left, children, right, bottomLeft, bottom, bottomRight, ...rest}) => {
		return (
			<Layout {...rest} orientation="vertical">
				<Cell shrink>
					<Layout>
						{topLeft || arranging ? <DroppableCell size={(!topLeft && arranging) ? 30 : '30%'} className={css.topLeft}  arrangement={arrangement} name="topLeft">{topLeft}</DroppableCell> : null}
						{(top || topLeft || topRight) || arranging ? <DroppableCell className={css.top} arrangement={arrangement} name="top">{top}</DroppableCell> : null}
						{topRight || arranging ? <DroppableCell size={(!topRight && arranging) ? 30 : '30%'} className={css.topRight} arrangement={arrangement} name="topRight">{topRight}</DroppableCell> : null}
					</Layout>
				</Cell>
				<Cell>
					<Layout className={css.bodyRow}>
						{left || arranging ? <DroppableCell size={(!left && arranging) ? 30 : '30%'} className={css.left}  arrangement={arrangement} name="left">{left}</DroppableCell> : null}
						<DroppableCell className={css.body}  arrangement={arrangement} name="children">{children}</DroppableCell>
						{right || arranging ? <DroppableCell size={(!right && arranging) ? 30 : '30%'} className={css.right} arrangement={arrangement} name="right">{right}</DroppableCell> : null}
					</Layout>
				</Cell>
				<Cell shrink>
					<Layout>
						{bottomLeft || arranging ? <DroppableCell size={(!bottomLeft && arranging) ? 30 : '30%'} className={css.bottomLeft}  arrangement={arrangement} name="bottomLeft">{bottomLeft}</DroppableCell> : null}
						{(bottom || bottomLeft || bottomRight) || arranging ? <DroppableCell className={css.bottom} arrangement={arrangement} name="bottom">{bottom}</DroppableCell> : null}
						{bottomRight || arranging ? <DroppableCell size={(!bottomRight && arranging) ? 30 : '30%'} className={css.bottomRight} arrangement={arrangement} name="bottomRight">{bottomRight}</DroppableCell> : null}
					</Layout>
				</Cell>
			</Layout>
		);
	}
});

const CustomLayout = DropManager(
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
