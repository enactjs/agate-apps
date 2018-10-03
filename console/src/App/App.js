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
import Home from '../views/Home';
import HVAC from '../views/HVAC';
import Phone from '../views/Phone';
import AppList from '../views/AppList';
import Settings from '../views/Settings';

import css from './App.less';

add('backspace', 8);

// Define these here and apply them to both the base defaults and the HOC, because apparently it's
// possible to accidentally impose a value mismatch during the initial render...
const colors = {
	carbon: {
		accent: '#8fd43a',
		highlight: '#6abe0b'
	},
	titanium: {
		accent: '#cccccc',
		highlight: '#4141d8'
	}
};

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: ({
		colorAccent,
		colorHighlight,
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
		if (!colorAccent && skinName) colorAccent = colors[skinName].accent;
		if (!colorHighlight && skinName) colorHighlight = colors[skinName].highlight;
		return (
			<div>
				<TabbedPanels
					{...rest}
					tabs={[
						{title: 'Home', icon: 'denselist'},
						{title: 'Phone', icon: 'phone'},
						{title: 'Climate', icon: 'temperature'},
						{title: 'Apps', icon: 'list'}
					]}
					onSelect={onSelect}
					selected={index}
					index={index}
				>
					<beforeTabs>
						<ColorPicker onChange={onColorChangeAccent} defaultValue={colorAccent} small />
						<ColorPicker onChange={onColorChangeHighlight} defaultValue={colorHighlight} small />
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
					/>
					<Phone />
					{/* eslint-disable-next-line */}
					<HVAC />
					<AppList
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}/>
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
			const defaultSkin = props.defaultSkin || 'carbon'; // 'titanium' alternate.
			this.state = {
				colorAccent: props.accent || colors[defaultSkin].accent,
				colorHighlight: props.highlight || colors[defaultSkin].highlight,
				index: props.defaultIndex || 0,
				showPopup: false,
				showBasicPopup: false,
				showDateTimePopup: false,
				showAppList: false,
				skin: defaultSkin
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
			this.setState(({skin}) => ({
				skin: (skin === 'carbon' ? 'titanium' : 'carbon'),
				colorAccent: this.props.accent || colors[skin].accent,
				colorHighlight: this.props.highlight || colors[skin].highlight
			}));
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
