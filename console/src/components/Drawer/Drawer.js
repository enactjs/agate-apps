import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import Item from '@enact/agate/Item';
import React from 'react';
import PropTypes from 'prop-types';
import Droppable, {Draggable} from '@enact/agate/DropManager';
import AppContextConnect from '../../App/AppContextConnect';

const DraggableCell = Draggable(Cell);
import css from './Drawer.less';
let allSlotNames = [];

const DrawerDefaultLayout = kind({
	name: 'Drawer',

	styles: {
		css,
		className: 'drawer'
	},

	propTypes: {
		items: PropTypes.array,
		navOpen: PropTypes.bool,
		onChange: PropTypes.func,
		onToggle: PropTypes.func
	},

	defaultProps: {
		navOpen: false
	},

	render: ({items, navOpen, onToggle, ...rest}) => {
		allSlotNames = items;
		return <nav role="navigation" className={`${css[`open__${navOpen}`]} ${css.drawer}`}>
            widgets
			<ul id="menu">
				{
					items && items.map((item, index) => {
						return <div key={index} style={{'display': 'inline'}}>
							<DraggableCell><Item
								style={{color:'white'}}
								key={index}
							>
								{item}
							</Item></DraggableCell>
						</div>;
					})
				}
			</ul>
		</nav>;
	}
});

const LayoutSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	arrangement: (userSettings.arrangements ? {...userSettings.arrangements.home} : {}),
	onArrange: ({arrangement}) => {
		updateAppState((state) => {
			if (!state.userSettings.arrangements) state.userSettings.arrangements = {};
			state.userSettings.arrangements.home = {...arrangement};
		});
	}
}));

const DrawerLayout =
	LayoutSetting(
		// Droppable({arrangementProp: 'myLayout', slots: allSlotNames},
		Droppable({slots: allSlotNames},
			DrawerDefaultLayout
		)
	);


const Drawer = kind({
	name: 'Drawer',

	propTypes: {
		arrangeable: PropTypes.bool,
		onSelect: PropTypes.func,
		widgetList: PropTypes.array
	},

	styles: {
		css,
		className: 'drawer'
	},

	render: ({arrangeable, onSelect, widgetList, ...rest}) => (
		<DrawerLayout arrangeable={arrangeable}>
			{
				allSlotNames && allSlotNames.map((item, index) => {
					return <div key={index} style={{'display': 'inline'}}>
						<DraggableCell><Item
							style={{color:'white'}}
							key={index}
						>
							{item}
						</Item></DraggableCell>
					</div>;
				})
			}
		</DrawerLayout>
	)
});

export default Drawer;
export {
	Drawer
};
