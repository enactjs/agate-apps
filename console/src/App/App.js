import {adaptEvent, forward, handle} from '@enact/core/handle';
import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Column} from '@enact/ui/Layout';
import compose from 'ramda/src/compose';
import hoc from '@enact/core/hoc';
import {add} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import DateTimePicker from '@enact/agate/DateTimePicker';
import React from 'react';
import {TabbedPanels} from '@enact/agate/Panels';

import Clock from '../components/Clock';
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

	handlers: {
		onSelect: handle(
			// this should probably be done in TabbedPanels to line up the event payload (index)
			// with the prop but i'm taking a shortcut for now
			adaptEvent(({selected}) => ({index: selected}), forward('onSelect'))
		)
	},

	render: ({
		onShowSettings,
		onShowHVAC,
		onShowPhone,
		onShowRadio,
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
						{title: 'Phone', icon: 'phone'},
						{title: 'Climate', icon: 'temperature'},
						{title: 'Radio', icon: 'audio'}
					]}
				>
					<afterTabs>
						<Column align="center space-evenly">
							<Cell shrink>
								<Clock />
							</Cell>
							<Cell shrink component={Button} type="grid" icon="fullscreen" small onTap={onSkinChange} />
						</Column>
					</afterTabs>
					<Home
						onShowHVAC={onShowHVAC}
						onShowPhone={onShowPhone}
						onShowSettings={onShowSettings}
						onShowRadio={onShowRadio}
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}
					/>
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
				index: props.defaultIndex || 0,
				showPopup: false,
				showBasicPopup: false,
				showDateTimePopup: false,
				skin: props.defaultSkin || 'carbon' // 'titanium' alternate.
			};
		}

		onSelect = handle(
			forward('onSelect'),
			({index}) => this.setState(state => state.index === index ? null : {index})
		).bind(this)


		onShowRadio = handle(
			adaptEvent(
				() => ({index: 4}),
				this.onSelect
			)
		);

		//TODO: embetter this
		onShowSettings = handle(
			adaptEvent(
				() => ({index: 3}),
				this.onSelect
			)
		);

		onShowHVAC = handle(
			adaptEvent(
				() => ({index: 2}),
				this.onSelect
			)
		);

		onShowPhone = handle(
			adaptEvent(
				() => ({index: 1}),
				this.onSelect
			)
		);
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
					index={this.state.index}
					onSelect={this.onSelect}
					onShowSettings={this.onShowSettings}
					onShowHVAC={this.onShowHVAC}
					onShowPhone={this.onShowPhone}
					onSkinChange={this.onSkinChange}
					onShowRadio={this.onShowRadio}
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
