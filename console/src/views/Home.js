import Drawer from '@enact/agate/Drawer';
import Droppable, {Draggable} from '@enact/agate/DropManager';
import Heading from '@enact/agate/Heading';
import {Panel} from '@enact/agate/Panels';
import {ToggleButtonBase} from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import Repeater from '@enact/ui/Repeater';
import PropTypes from 'prop-types';

import AppContextConnect from '../App/AppContextConnect';
import CompactAppList from '../components/CompactAppList';
import CompactHvac from '../components/CompactHVAC';
import CompactMap from '../components/CompactMap';
import CompactMultimedia from '../components/CompactMultimedia';
import CompactMusic from '../components/CompactMusic';
import CompactScreenMonitor from '../components/CompactScreenMonitor';
import CompactWeather from '../components/CompactWeather';

import css from './Home.module.less';

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

	render: ({arrangeable, skin, small1, small2, medium, large, layoutArrangeableEnd, ...rest}) => {
		delete rest.arrangement;

		const widgetTray = (
			<Drawer className={css.drawer} open={arrangeable} scrimType="transparent">
				<header className={css.header}>
					<Cell className={css.title} component={Heading} shrink>Additional Widgets</Cell>
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
				<footer className={css.footer}>
					<Row>
						<Cell
							component={ToggleButtonBase}
							onClick={layoutArrangeableEnd}
							selected
							size="small"
							toggleOffLabel="Edit Layout"
							toggleOnLabel="Done"
							type="grid"
							underline
						/>
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
							<Cell className={css.horizontalDivider} size="50%">
								<Row className={css.row}>
									<DraggableCell className={css.small1} containerShape={{edges: {bottom: true}, size: {relative: 'small'}}} name="small1">{small1}</DraggableCell>
									<Cell className={css.verticalDivider} shrink />
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
									<Cell className={css.verticalDivider} shrink />
									<DraggableCell className={css.small2} containerShape={{edges: {top: true}, size: {relative: 'small'}}} name="small2">{small2}</DraggableCell>
								</Row>
							</Cell>
							<Cell className={css.horizontalDivider} size="50%">
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
		loadGoogleMaps: PropTypes.bool,
		onCompactExpand: PropTypes.func,
		onSelect: PropTypes.func,
		onSendVideo: PropTypes.func
	},

	styles: {
		css,
		className: 'homePanel'
	},

	render: ({arrangeable, loadGoogleMaps, onCompactExpand, onSendVideo, onSelect, ...rest}) => (
		<Panel {...rest} css={css}>
			<HomeLayout arrangeable={arrangeable}>
				<tray1><CompactHvac onExpand={onCompactExpand} /></tray1>
				<tray2><CompactAppList onExpand={onCompactExpand} onSelect={onSelect} /></tray2>
				<tray3><CompactWeather onExpand={onCompactExpand} /></tray3>

				<small1><CompactMusic onExpand={onCompactExpand} /></small1>
				<small2><CompactScreenMonitor onExpand={onCompactExpand} /></small2>
				<medium><CompactMultimedia onExpand={onCompactExpand} onSendVideo={onSendVideo} screenIds={[1]} /></medium>
				{loadGoogleMaps ? <large><CompactMap onExpand={onCompactExpand} /></large> : <></> }
			</HomeLayout>
		</Panel>
	)
});

export default Home;
