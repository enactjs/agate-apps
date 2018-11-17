import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import Repeater from '@enact/ui/Repeater';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';
import Droppable, {Draggable, ResponsiveBox} from '@enact/agate/DropManager';
import IconItem from '@enact/agate/IconItem';
import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import Drawer from '@enact/agate/Drawer';

import AppContextConnect from '../App/AppContextConnect';
import CompactAppList from '../components/CompactAppList';
import CompactHvac from '../components/CompactHVAC';
import CompactMap from '../components/CompactMap';
import CompactMultimedia from '../components/CompactMultimedia';
import CompactRadio from '../components/CompactRadio';
import CompactWeather from '../components/CompactWeather';

import css from './Home.less';

const allSlotNames = ['small1', 'small2', 'medium', 'large', 'tray1', 'tray2', 'tray3', 'tray4'];

const DraggableCell = Draggable(Cell);

// This component allows its consumer to assign a "title" to `component`, which is used in a list
// context. Outside a list context, the component is returned as-is, any other props and all.
//
// The `description` here is a little silly and is more of a POC, but could be useful with some
// tweaking. It could also be removed if it adds no value to the user.
const ResponsiveWidget = ResponsiveBox(({component: Component, containerShape, description, title, ...rest}) => {
	const relativeSize = (containerShape && containerShape.size && containerShape.size.relative);
	switch (relativeSize) {
		case 'list': return (
			<IconItem css={css} label={description} icon="list">{title}</IconItem>
		);
		default: return (
			<Component {...rest} />
		);
	}
});


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
		medium: PropTypes.node,
		skin: PropTypes.string,
		small1: PropTypes.node,
		small2: PropTypes.node
	},

	styles: {
		css,
		className: 'home'
	},

	render: ({arrangeable, skin, small1, small2, medium, large, layoutArrangeableEnd, ...rest}) => {
		delete rest.arrangement;

		const widgetTray = (
			<Drawer open={arrangeable} scrimType="none">
				<header>
					<Cell component={Divider} shrink>Additional Widgets</Cell>
				</header>
				<WidgetTray>
					{allSlotNames.filter(name => name.indexOf('tray') === 0).map(name => {
						// generate a list of objects, which will relate to slots being created,
						// that are defined in the `allSlotNames` array. This only creates empty
						// slots. It's the duty of the `Home` kind to populate these with content.
						// These slots are part of the HomeLayout collection of slots
						const slotContent = rest[name];
						delete rest[name];
						return ({
							key: name,
							name,
							children: slotContent
						});
					})}
				</WidgetTray>
				<footer>
					<Button small onTap={layoutArrangeableEnd}>Finish</Button>
				</footer>
			</Drawer>
		);

		// Layouts below are modeled after the UX layout recommendation document, numbered for this
		// case as 1-4 in the left column and 5-8 on the right column.
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
		onSelect: PropTypes.func
	},

	styles: {
		css,
		className: 'homePanel'
	},

	render: ({arrangeable, onSelect, onSendVideo, ...rest}) => (
		<Panel {...rest}>
			<HomeLayout arrangeable={arrangeable}>
				<tray1><ResponsiveWidget title="Favorite Apps" description="A selection of your favorite apps" component={CompactAppList} /></tray1>
				<tray2><ResponsiveWidget title="A/C" description="Air conditioning and seat warmers" component={CompactHvac} /></tray2>

				<small1><ResponsiveWidget title="Weather" description="Local weather information" component={CompactWeather} /></small1>
				<small2><ResponsiveWidget title="Radio" description="Listen to AM/FM" component={CompactRadio} /></small2>
				<medium><ResponsiveWidget title="Multimedia" description="Watch videos or listen to music" component={CompactMultimedia} onSendVideo={onSendVideo} /></medium>
				<large><ResponsiveWidget title="Map" description="Choose a destination and navigate" component={CompactMap} onSelect={onSelect} /></large>
			</HomeLayout>
		</Panel>
	)
});

export default Home;
