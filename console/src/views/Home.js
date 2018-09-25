import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
// import hoc from '@enact/core/hoc';
import Slottable from '@enact/ui/Slottable';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
// import ReactDOM from 'react-dom';
import LabeledIconButton from '@enact/agate/LabeledIconButton';

import DropZone from '../components/DropZone';

import css from './Home.less';

// const propSwap = (one, two) => {
// 	const tmp = one;
// 	one = two;
// 	two = tmp;

// };


const DropZoneRow = Slottable({slots: ['00', '01', '02']}, DropZone(Row));

const HomeIconCell = kind({
	name: 'HomeIconCell',
	styles: {
		css,
		className: 'iconCell'
	},

	render: ({children, ...rest}) => (
		<Cell draggable="true" component={LabeledIconButton} size={180} {...rest}>{children}</Cell>
	)
});

const Home = kind({
	name: 'Home',

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({selected: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({onTabChange, onTogglePopup, onToggleBasicPopup, onPopupOpen, ...rest}) => {
		return(
			<Panel {...rest}>
				<Column align="center center">
					<Cell shrink>
						<DropZoneRow align="start center" id="row0">
							<HomeIconCell id="slot00" data-slot="00" icon="temperature" data-tabindex={2} onKeyUp={onTabChange} onClick={onTabChange}>Climate</HomeIconCell>
							<HomeIconCell id="slot01" data-slot="01" icon="compass">Navigation</HomeIconCell>
							<HomeIconCell id="slot02" data-slot="02" icon="phone" data-tabindex={1} onKeyUp={onTabChange} onClick={onTabChange}>Phone</HomeIconCell>
						</DropZoneRow>
					</Cell>
					<Cell shrink>
						<DropZoneRow align="start center" id="row1">
							<HomeIconCell id="slot10" data-slot="10" icon="audio">Radio</HomeIconCell>
							<HomeIconCell id="slot11" data-slot="11" icon="resumeplay">Multimedia</HomeIconCell>
							<HomeIconCell id="slot12" data-slot="12" icon="repeat" onKeyUp={onPopupOpen} onClick={onToggleBasicPopup}>Connect</HomeIconCell>
						</DropZoneRow>
					</Cell>
					<Cell shrink>
						<DropZoneRow align="start center" id="row2" data-slot="row2">
							<HomeIconCell id="slot20" data-slot="20" icon="repeatdownload">Dashboard</HomeIconCell>
							<HomeIconCell id="slot21" data-slot="21" icon="gear" data-tabindex={3} onKeyUp={onTabChange} onClick={onTabChange}>Settings</HomeIconCell>
							<HomeIconCell id="slot22" data-slot="22" icon="closex" onClick={onTogglePopup}>Point of Interest</HomeIconCell>
						</DropZoneRow>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

export default Home;
