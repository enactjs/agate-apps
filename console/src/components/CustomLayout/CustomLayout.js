import kind from '@enact/core/kind';
import {Layout, Cell} from '@enact/ui/Layout';
import Droppable, {Draggable} from '@enact/agate/DropManager';
import PropTypes from 'prop-types';

import AppContextConnect from '../../App/AppContextConnect';

import css from './CustomLayout.module.less';

const allSlotNames = ['bottom', 'bottomLeft', 'bottomRight', 'children', 'top', 'topLeft', 'topRight', 'left', 'right'];

const DraggableCell = Draggable(Cell);

const containerShapes = {
	topLeft:     {orientation: 'landscape', edges: {top: true, left: true}},
	top:         {orientation: 'landscape', edges: {top: true}},
	topRight:    {orientation: 'landscape', edges: {top: true, right: true}},
	left:        {orientation: 'portrait', edges: {left: true}},
	right:       {orientation: 'portrait', edges: {right: true}},
	bottomLeft:  {orientation: 'landscape', edges: {bottom: true, left: true}},
	bottom:      {orientation: 'landscape', edges: {bottom: true}},
	bottomRight: {orientation: 'landscape', edges: {bottom: true, right: true}}
};

const CustomLayoutBase = kind({
	name: 'CustomLayout',

	propTypes: {
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

	render: ({arranging, topLeft, top, topRight, left, children, right, bottomLeft, bottom, bottomRight, ...rest}) => {
		return (
			<Layout {...rest} orientation="vertical">
				<Cell shrink>
					<Layout>
						{topLeft || arranging ? <DraggableCell containerShape={containerShapes.topLeft} size={(!topLeft && arranging) ? 30 : '30%'} className={css.topLeft} name="topLeft">{topLeft}</DraggableCell> : null}
						{(top || topLeft || topRight) || arranging ? <DraggableCell containerShape={containerShapes.top} className={css.top} name="top">{top}</DraggableCell> : null}
						{topRight || arranging ? <DraggableCell containerShape={containerShapes.topRight} size={(!topRight && arranging) ? 30 : '30%'} className={css.topRight} name="topRight">{topRight}</DraggableCell> : null}
					</Layout>
				</Cell>
				<Cell>
					<Layout className={css.bodyRow}>
						{left || arranging ? <DraggableCell containerShape={containerShapes.left} size={(!left && arranging) ? 30 : '30%'} className={css.left} name="left">{left}</DraggableCell> : null}
						<DraggableCell className={css.body} name="children">{children}</DraggableCell>
						{right || arranging ? <DraggableCell containerShape={containerShapes.right} size={(!right && arranging) ? 30 : '30%'} className={css.right} name="right">{right}</DraggableCell> : null}
					</Layout>
				</Cell>
				<Cell shrink>
					<Layout>
						{bottomLeft || arranging ? <DraggableCell containerShape={containerShapes.bottomLeft} size={(!bottomLeft && arranging) ? 30 : '30%'} className={css.bottomLeft} name="bottomLeft">{bottomLeft}</DraggableCell> : null}
						{(bottom || bottomLeft || bottomRight) || arranging ? <DraggableCell containerShape={containerShapes.bottom} className={css.bottom} name="bottom">{bottom}</DraggableCell> : null}
						{bottomRight || arranging ? <DraggableCell containerShape={containerShapes.bottomRight} size={(!bottomRight && arranging) ? 30 : '30%'} className={css.bottomRight} name="bottomRight">{bottomRight}</DraggableCell> : null}
					</Layout>
				</Cell>
			</Layout>
		);
	}
});

const SaveLayoutArrangement = (layoutName) => AppContextConnect(({userSettings, updateAppState}) => ({
	arrangement: (userSettings.arrangements && {...userSettings.arrangements[layoutName]}),
	onArrange: ({arrangement}) => {
		updateAppState((state) => {
			if (!state.userSettings.arrangements) state.userSettings.arrangements = {};
			state.userSettings.arrangements[layoutName] = {...arrangement};
		});
	}
}));


const CustomLayout = Droppable({arrangingProp: 'arranging', slots: allSlotNames},
	CustomLayoutBase
);

export default CustomLayout;
export {
	CustomLayout,
	SaveLayoutArrangement
};
