import kind from '@enact/core/kind';
import {Layout, Cell} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import React from 'react';

import Rearrangeable from '../Rearrangeable';
import DropZone, {Draggable} from '../DropZone';

import css from './CustomLayout.less';

const allSlotNames = ['children', 'footer', 'footerLeft', 'footerRight', 'header', 'headerLeft', 'headerRight', 'left', 'right'];

const DroppableCell = Draggable(Cell);

const CustomLayoutBase = kind({
	name: 'CustomLayout',

	propTypes: {
		arrangement: PropTypes.object,
		arranging: PropTypes.bool,
		children: PropTypes.node,
		footer: PropTypes.node,
		footerLeft: PropTypes.node,
		footerRight: PropTypes.node,
		header: PropTypes.node,
		headerLeft: PropTypes.node,
		headerRight: PropTypes.node,
		left: PropTypes.node,
		right: PropTypes.node
	},

	styles: {
		css,
		className: 'customLayout'
		// className: 'customLayout debug layout'
		// className: 'customLayout debug layout drag'
	},

	render: ({arrangement, arranging, header, headerLeft, headerRight, left, children, right, footer, footerLeft, footerRight, ...rest}) => {
		return (
			<Layout {...rest} orientation="vertical">
				<Cell shrink>
					<Layout>
						{headerLeft || arranging ? <DroppableCell size={(!headerLeft && arranging) ? 30 : '30%'} className={css.headerLeft}  arrangement={arrangement} name="headerLeft">{headerLeft}</DroppableCell> : null}
						{(header || headerLeft || headerRight) || arranging ? <DroppableCell className={css.header} arrangement={arrangement} name="header">{header}</DroppableCell> : null}
						{headerRight || arranging ? <DroppableCell size={(!headerRight && arranging) ? 30 : '30%'} className={css.headerRight} arrangement={arrangement} name="headerRight">{headerRight}</DroppableCell> : null}
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
						{footerLeft || arranging ? <DroppableCell size={(!footerLeft && arranging) ? 30 : '30%'} className={css.footerLeft}  arrangement={arrangement} name="footerLeft">{footerLeft}</DroppableCell> : null}
						{(footer || footerLeft || footerRight) || arranging ? <DroppableCell className={css.footer} arrangement={arrangement} name="footer">{footer}</DroppableCell> : null}
						{footerRight || arranging ? <DroppableCell size={(!footerRight && arranging) ? 30 : '30%'} className={css.footerRight} arrangement={arrangement} name="footerRight">{footerRight}</DroppableCell> : null}
					</Layout>
				</Cell>
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
