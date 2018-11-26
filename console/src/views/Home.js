import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';
import Droppable, {Draggable} from '@enact/agate/DropManager';

import AppContextConnect from '../App/AppContextConnect';
// import CompactAppList from '../components/CompactAppList';
// import CompactHvac from '../components/CompactHVAC';
import CompactMap from '../components/CompactMap';
import CompactMultimedia from '../components/CompactMultimedia';
import CompactMusic from '../components/CompactMusic';
import CompactWeather from '../components/CompactWeather';

import css from './Home.less';

const allSlotNames = ['small1', 'small2', 'medium', 'large'];

const DraggableCell = Draggable(Cell);

// Store multiple layouts all in one component
// Here, we've made 4 slots with agnostic names and reused those names in the various positions of
// multiple layouts. This will keep the slots working properly even if a user switches layouts.
// The containerShape is defined in each cell to allow the widgets in them to respond appropriately
// even though the slot shape may have changed from layout to layout.
const HomeLayouts = kind({
	name: 'HomeLayouts',

	propTypes: {
		arrangeable: PropTypes.bool,
		arrangement: PropTypes.object,
		large: PropTypes.node,
		medium: PropTypes.node,
		skin: PropTypes.string,
		small1: PropTypes.node,
		small2: PropTypes.node
	},

	styles: {
		css,
		className: 'home'
	},

	render: ({skin, small1, small2, medium, large, ...rest}) => {
		delete rest.arrangement;

		// Layouts below are modeled after the UX layout recommendation document, numbered for this
		// case as 1-4 in the left column and 5-8 on the right column.
		switch (skin) {
			// Layout #3
			case 'titanium': return (
				<Row {...rest}>
					<Cell size="50%">
						<Row className={css.row}>
							<DraggableCell className={css.large} containerShape={{edges: {top: true, left: true, bottom: true}, size: {relative: 'large'}, orientation: 'landscape'}} name="large">{large}</DraggableCell>
						</Row>
					</Cell>
					<Cell size="50%">
						<Column>
							<Cell size="50%">
								<Row className={css.row}>
									<DraggableCell className={css.medium} containerShape={{edges: {top: true, right: true}, size: {relative: 'medium'}, orientation: 'landscape'}} name="medium">{medium}</DraggableCell>
								</Row>
							</Cell>
							<Cell size="50%">
								<Row className={css.row}>
									<DraggableCell className={css.small1} containerShape={{edges: {bottom: true}, size: {relative: 'small'}}} name="small1">{small1}</DraggableCell>
									<DraggableCell className={css.small2} containerShape={{edges: {bottom: true, right: true}, size: {relative: 'small'}}} name="small2">{small2}</DraggableCell>
								</Row>
							</Cell>
						</Column>
					</Cell>
				</Row>
			);
			// Layout #2
			default: return (
				<Row {...rest}>
					<Cell size="50%">
						<Column>
							<Cell size="50%">
								<Row className={css.row}>
									<DraggableCell className={css.small1} containerShape={{edges: {top: true, left: true}, size: {relative: 'small'}}} name="small1">{small1}</DraggableCell>
									<DraggableCell className={css.small2} containerShape={{edges: {top: true}, size: {relative: 'small'}}} name="small2">{small2}</DraggableCell>
								</Row>
							</Cell>
							<Cell size="50%">
								<Row className={css.row}>
									<DraggableCell className={css.medium} containerShape={{edges: {bottom: true, left: true}, size: {relative: 'medium'}, orientation: 'landscape'}} name="medium">{medium}</DraggableCell>
								</Row>
							</Cell>
						</Column>
					</Cell>
					<Cell size="50%">
						<Row className={css.row}>
							<DraggableCell className={css.large} containerShape={{edges: {top: true, right: true, bottom: true}, size: {relative: 'large'}, orientation: 'landscape'}} name="large">{large}</DraggableCell>
						</Row>
					</Cell>
				</Row>
			);
		}
	}
});

const LayoutSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	arrangement: (userSettings.arrangements ? {...userSettings.arrangements.home} : {}),
	skin: userSettings.skin,
	onArrange: ({arrangement}) => {
		updateAppState((state) => {
			if (!state.userSettings.arrangements) state.userSettings.arrangements = {};
			state.userSettings.arrangements.home = {...arrangement};
		});
	}
}));

const HomeLayout =
	LayoutSetting(
		Droppable({slots: allSlotNames},
			HomeLayouts
		)
	);

const Home = kind({
	name: 'Home',

	propTypes: {
		arrangeable: PropTypes.bool,
		onCompactExpand: PropTypes.func
	},

	styles: {
		css,
		className: 'homePanel'
	},

	render: ({arrangeable, onCompactExpand, onSendVideo, onSelect, ...rest}) => (
		<Panel {...rest}>
			<HomeLayout arrangeable={arrangeable}>
				<small1><CompactWeather onExpand={onCompactExpand} /></small1>
				<small2><CompactMusic onExpand={onCompactExpand} /></small2>
				<medium><CompactMultimedia onExpand={onCompactExpand} onSendVideo={onSendVideo} /></medium>
				<large><CompactMap onSelect={onSelect} /></large>
			</HomeLayout>
		</Panel>
	)
});

export default Home;
