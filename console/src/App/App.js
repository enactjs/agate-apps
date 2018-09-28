import {forward, handle} from '@enact/core/handle';
import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Column} from '@enact/ui/Layout';
import compose from 'ramda/src/compose';
import hoc from '@enact/core/hoc';
import {add} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import ColorPicker from '@enact/agate/ColorPicker';
import Popup from '@enact/agate/Popup';
import DateTimePicker from '@enact/agate/DateTimePicker';
import React from 'react';
import {TabbedPanels} from '@enact/agate/Panels';

import Clock from '../components/Clock';
import CustomLayout from '../components/CustomLayout';
import Home from '../views/Home';
import HVAC from '../views/HVAC';
import Phone from '../views/Phone';
import Radio from '../views/Radio';
import Settings from '../views/Settings';

import css from './App.less';

add('backspace', 8);

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: ({
		accent,
		highlight,
		index,
		onColorChangeAccent,
		onColorChangeHighlight,
		onSelect,
		onSkinChange,
		onTogglePopup,
		onToggleBasicPopup,
		onToggleDateTimePopup,
		showPopup,
		showBasicPopup,
		showDateTimePopup,
		skinName,
		...rest
	}) => {
		return (
			<div>
				<TabbedPanels
					{...rest}
					tabs={[
						{title: 'Home', icon: 'denselist'},
						{title: 'Layout', icon: 'series'},
						{title: 'Phone', icon: 'phone'},
						{title: 'Climate', icon: 'temperature'},
						{title: 'Radio', icon: 'audio'}
					]}
					onSelect={onSelect}
					selected={index}
					index={index}
				>
					<beforeTabs>
						<ColorPicker onChange={onColorChangeAccent} defaultValue={accent} small />
						<ColorPicker onChange={onColorChangeHighlight} defaultValue={highlight} small />
					</beforeTabs>
					<afterTabs>
						<Column align="center space-evenly">
							<Cell shrink>
								<Clock />
							</Cell>
							<Cell shrink component={Button} type="grid" icon="fullscreen" small onTap={onSkinChange} />
						</Column>
					</afterTabs>
					<Home
						onSelect={onSelect}
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}
					/>
					{/*<CustomLayout>
					{
						[
							null,
							'left',
							'Body Content space',
							null,
							'bottom'
						]
					}
					</CustomLayout>*/}
					{/* arrangement={{right: 'left', left: 'bottom'}}  defaultArrangement={{right: 'left', left: 'right'}} */}
					<CustomLayout onArrange={console.log}>
						{/*<top>red top content</top>*/}
						<left>yellow left content <Button>Transport Mode</Button></left>
						green body content
						<right>blue right content</right>
						<bottom>purple bottom content
							<Button type="grid" icon="fullscreen" small onTap={onSkinChange} />
						</bottom>
					</CustomLayout>
					<Phone />
					{/* eslint-disable-next-line */}
					<HVAC />
					<Radio />
					<Settings
						onToggleDateTimePopup={onToggleDateTimePopup}
					/>
				</TabbedPanels>
				<Popup
					onClose={onToggleBasicPopup}
					open={showBasicPopup}
				>
					{`Popup for ${skinName} skin`}
				</Popup>
				<Popup
					onClose={onTogglePopup}
					open={showPopup}
					closeButton
				>
					<title>
						{`Popup for ${skinName} skin`}
					</title>
					This is an example of a popup with a body section and a title. Plus there&apos;re buttons!
					<buttons>
						<Button>Transport Mode</Button>
					</buttons>
				</Popup>
				<Popup
					onClose={onToggleDateTimePopup}
					open={showDateTimePopup}
					closeButton
				>
					<title>
						Date & Time
					</title>
					<DateTimePicker onClose={onToggleDateTimePopup}/>
				</Popup>
			</div>
		);
	}
});

const AppState = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'AppState';
		constructor (props) {
			super(props);
			this.state = {
				colorAccent: '#cccccc',
				colorHighlight: '#66aabb',
				index: props.defaultIndex || 0,
				showPopup: false,
				showBasicPopup: false,
				showDateTimePopup: false,
				showRadio: false,
				skin: props.defaultSkin || 'carbon' // 'titanium' alternate.
			};
		}

		onSelect = handle(
			forward('onSelect'),
			(ev) => {
				const {index} = ev;
				this.setState(state => state.index === index ? null : {index});
			}
		).bind(this);

		onColorChangeAccent = ({value}) => {
			this.setState({colorAccent: value});
		};

		onColorChangeHighlight = ({value}) => {
			this.setState({colorHighlight: value});
		};

		onSkinChange = () => {
			this.setState(({skin}) => ({skin: (skin === 'carbon' ? 'titanium' : 'carbon')}));
		};

		onTogglePopup = () => {
			this.setState(({showPopup}) => ({showPopup: !showPopup}));
		};

		onToggleBasicPopup = () => {
			this.setState(({showBasicPopup}) => ({showBasicPopup: !showBasicPopup}));
		};

		onToggleDateTimePopup = () => {
			this.setState(({showDateTimePopup}) => ({showDateTimePopup: !showDateTimePopup}));
		};

		render () {
			const props = {...this.props};

			delete props.defaultIndex;
			delete props.defaultSkin;

			return (
				<Wrapped
					{...props}
					accent={this.state.colorAccent}
					highlight={this.state.colorHighlight}
					index={this.state.index}
					onColorChangeAccent={this.onColorChangeAccent}
					onColorChangeHighlight={this.onColorChangeHighlight}
					onSelect={this.onSelect}
					onSkinChange={this.onSkinChange}
					onTogglePopup={this.onTogglePopup}
					onToggleBasicPopup={this.onToggleBasicPopup}
					onToggleDateTimePopup={this.onToggleDateTimePopup}
					orientation={(this.state.skin === 'titanium') ? 'horizontal' : 'vertical'}
					showPopup={this.state.showPopup}
					showBasicPopup={this.state.showBasicPopup}
					showDateTimePopup={this.state.showDateTimePopup}
					skin={this.state.skin}
					skinName={this.state.skin}
				/>
			);
		}
	};
});

const AppDecorator = compose(
	AppState,
	AgateDecorator
);

const App = AppDecorator(AppBase);

export default App;
