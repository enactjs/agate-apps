import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import ComponentOverride from '@enact/ui/ComponentOverride';
import Repeater from '@enact/ui/Repeater';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';
import Droppable, {Draggable} from '@enact/agate/DropManager';
import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import Drawer from '@enact/agate/Drawer';

import AppContextConnect from '../App/AppContextConnect';
import CompactAppList from '../components/CompactAppList';
import CompactHvac from '../components/CompactHVAC';
import CompactMap from '../components/CompactMap';
import CompactMultimedia from '../components/CompactMultimedia';
import CompactMusic from '../components/CompactMusic';
import CompactWeather from '../components/CompactWeather';

import css from './Home.less';

const allSlotNames = ['small1', 'small2', 'medium', 'large', 'tray1', 'tray2', 'tray3', 'tray4'];

const DraggableCell = Draggable(Cell);

const WidgetTray = kind({
	name: 'WidgetTray',
	render: ({children, ...rest}) => (
		<Column
			{...rest}
			component={Repeater}
			childComponent={DraggableCell}
			itemProps={{
				className: css.trayCell,
				containerShape: {
					edges: {left: true, right: true},
					size: {relative: 'list'},
					orientation: 'landscape'
				},
				shrink: true
			}}
		>
			{children}
		</Column>
	)
});

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
		layoutArrangeableEnd: PropTypes.func,
		medium: PropTypes.node,
		skin: PropTypes.string,
		small1: PropTypes.node,
		small2: PropTypes.node
	},

	styles: {
		css,
		className: 'home'
	},

	render: (props) => {
		const {arrangeable, skin, small1, small2, medium, large, layoutArrangeableEnd, ...rest} = props;
		delete rest.arrangement;

		const widgetTray = (
			<Drawer className={css.drawer} open={arrangeable} scrimType="none">
				<header className={css.header}>
					<Cell className={css.title} component={Divider} shrink>Edit Apps</Cell>
				</header>
				<WidgetTray>
					{allSlotNames.filter(name => props[name]).map(name => {
						const Component = props[name];
						const disabled = name.indexOf('tray') !== 0;
						return ({
							draggable: !disabled,
							key: name,
							name,
							children: <ComponentOverride component={Component} disabled={disabled} />
						});
					})}
				</WidgetTray>
				<footer className={css.footer}>
					<Row>
						<Cell className={css} component={Button} onTap={layoutArrangeableEnd} small>Done</Cell>
					</Row>
				</footer>
			</Drawer>
		);

		// Layouts below are modeled after the UX layout recommendation document, numbered for this
		// case as 1-4 in the left column and 5-8 on the right column.
		// 4 4 3 3
		// 4 4 1 2
		switch (skin) {
			// Layout #3
			case 'titanium': return (
				<Row {...rest}>
					{widgetTray}
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
			// 1 2 4 4
			// 3 3 4 4
			default: return (
				<Row {...rest}>
					{widgetTray}
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
	layoutArrangeableEnd: () => {
		updateAppState((state) => {
			state.userSettings.arrangements.arrangeable = false;
		});
	},
	onArrange: ({arrangement}) => {
		updateAppState((state) => {
			if (!state.userSettings.arrangements) state.userSettings.arrangements = {};
			state.userSettings.arrangements.home = {...arrangement};
		});
	}
}));

const HomeLayout =
	LayoutSetting(
		Droppable({arrangeableProp: 'arrangeable', slots: allSlotNames},
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
				<tray1><CompactAppList icon="list" onExpand={onCompactExpand} /></tray1>
				<tray2><CompactHvac icon="temperature" onExpand={onCompactExpand} /></tray2>

				<small1><CompactWeather icon="climate" onExpand={onCompactExpand} /></small1>
				<small2><CompactMusic icon="audio" onExpand={onCompactExpand} /></small2>
				<medium><CompactMultimedia icon="resumeplay" onExpand={onCompactExpand} onSendVideo={onSendVideo} /></medium>
				<large><CompactMap icon="compass" onExpand={onCompactExpand} onSelect={onSelect} /></large>
			</HomeLayout>
		</Panel>
	)
});

export default Home;
