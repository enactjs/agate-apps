import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';
import Droppable, {Draggable} from '@enact/agate/DropManager';

import AppContextConnect from '../App/AppContextConnect';
import CompactAppList from '../components/CompactAppList';
import CompactHvac from '../components/CompactHVAC';
import CompactMap from '../components/CompactMap';
import CompactMultimedia from '../components/CompactMultimedia';
import CompactRadio from '../components/CompactRadio';
import CompactWeather from '../components/CompactWeather';

import css from './Home.less';

const allSlotNames = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight', 'topCenter'];

const DraggableCell = Draggable(Cell);

const HomeDefaultLayout = kind({
	name: 'HomeDefaultLayout',

	propTypes: {
		bottomLeft: PropTypes.node,
		bottomRight: PropTypes.node,
		topCenter: PropTypes.node,
		topLeft: PropTypes.node,
		topRight: PropTypes.node
	},

	styles: {
		css,
		className: 'home'
	},

	render: ({bottomLeft, bottomRight, topLeft, topRight, topCenter, ...rest}) => {
		return (
			<Column {...rest}>
				<Cell size="40%">
					<Row className={css.row}>
						<DraggableCell size="30%" className={css.topLeft} containerShape={{edges: {top: true, left: true}, size: {relative: 'small'}}} name="topLeft">{topLeft}</DraggableCell>
						<DraggableCell className={css.topCenter} name="topCenter">{topCenter}</DraggableCell>
						<DraggableCell className={css.topRight} containerShape={{edges: {top: true, right: true}, size: {relative: 'medium'}, orientation: 'landscape'}} name="topRight">{topRight}</DraggableCell>
					</Row>
				</Cell>
				<Cell>
					<Row className={css.row}>
						<DraggableCell size="30%" className={css.bottomLeft} containerShape={{edges: {bottom: true, left: true}, size: {relative: 'medium'}, orientation: 'portrait'}} name="bottomLeft">{bottomLeft}</DraggableCell>
						<DraggableCell className={css.bottomRight} containerShape={{edges: {bottom: true, right: true}, size: {relative: 'large'}, orientation: 'landscape'}} name="bottomRight">{bottomRight}</DraggableCell>
					</Row>
				</Cell>
			</Column>
		);
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


const HomeLayout =
	LayoutSetting(
		// Droppable({arrangementProp: 'myLayout', slots: allSlotNames},
		Droppable({slots: allSlotNames},
			HomeDefaultLayout
		)
	);

const Home = kind({
	name: 'Home',

	propTypes: {
		arrangeable: PropTypes.bool,
		onSelect: PropTypes.func
	},

	styles: {
		css,
		className: 'homePanel'
	},

	render: ({arrangeable, onSelect, onSendVideo, setDestination, ...rest}) => (
		<Panel {...rest}>
			<HomeLayout arrangeable={arrangeable}>
				<topLeft><CompactRadio /></topLeft>
				<topCenter><CompactWeather /></topCenter>
				<topRight><CompactHvac /></topRight>
				{/*<bottomLeft><CompactAppList align="center space-evenly" onSelect={onSelect} /></bottomLeft>*/}
				<bottomLeft><CompactMultimedia onSendVideo={onSendVideo} /></bottomLeft>
				<bottomRight><CompactMap onSelect={onSelect} setDestination={setDestination} /></bottomRight>
			</HomeLayout>
		</Panel>
	)
});

export default Home;
