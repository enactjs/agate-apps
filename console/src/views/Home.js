import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
// import hoc from '@enact/core/hoc';
import Slottable from '@enact/ui/Slottable';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
// import ReactDOM from 'react-dom';
import LabeledIconButton from '@enact/agate/LabeledIconButton';

import Rearrangeable from '../components/Rearrangeable';
import DropZone, {Draggable} from '../components/DropZone';

import css from './Home.less';

// const propSwap = (one, two) => {
// 	const tmp = one;
// 	one = two;
// 	two = tmp;

// };

const HomeRow = kind({
	name: 'HomeRow',
	render: ({slot00, slot01, slot02, ...rest}) => {
		delete rest.arrangement;
		delete rest.arranging;
		return (
			<Row {...rest}>
				{slot00}
				{slot01}
				{slot02}
			</Row>
		);
	}
});

const DropZoneRow = DropZone(
	Slottable({slots: ['slot00', 'slot01', 'slot02']},
		Rearrangeable({slots: ['slot00', 'slot01', 'slot02']},
			HomeRow
		)
	)
);

const HomeIconCell = Draggable(kind({
	name: 'HomeIconCell',
	styles: {
		css,
		className: 'iconCell'
	},

	render: ({children, ...rest}) => (
		<Cell component={LabeledIconButton} size={180} {...rest}>{children}</Cell>
	)
}));

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
						<DropZoneRow align="start center">
							<HomeIconCell name="slot00" slot="slot00" icon="temperature" data-tabindex={2} onKeyUp={onTabChange} onClick={onTabChange}>Climate</HomeIconCell>
							<HomeIconCell name="slot01" slot="slot01" icon="compass">Navigation</HomeIconCell>
							<HomeIconCell name="slot02" slot="slot02" icon="phone" data-tabindex={1} onKeyUp={onTabChange} onClick={onTabChange}>Phone</HomeIconCell>
						</DropZoneRow>
					</Cell>
					<Cell shrink>
						<DropZoneRow align="start center">
							<HomeIconCell name="s00" slot="slot00" icon="audio">Radio</HomeIconCell>
							<HomeIconCell name="s01" slot="slot01" icon="resumeplay">Multimedia</HomeIconCell>
							<HomeIconCell name="s02" slot="slot02" icon="repeat" onKeyUp={onPopupOpen} onClick={onToggleBasicPopup}>Connect</HomeIconCell>
						</DropZoneRow>
					</Cell>
					<Cell shrink>
						<DropZoneRow align="start center">
							<HomeIconCell slot="slot00" icon="repeatdownload">Dashboard</HomeIconCell>
							<HomeIconCell slot="slot01" icon="gear" data-tabindex={3} onKeyUp={onTabChange} onClick={onTabChange}>Settings</HomeIconCell>
							<HomeIconCell slot="slot02" icon="closex" onClick={onTogglePopup}>Point of Interest</HomeIconCell>
						</DropZoneRow>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

export default Home;
