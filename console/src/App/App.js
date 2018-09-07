import {adaptEvent, forward, handle} from '@enact/core/handle';
import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import compose from 'ramda/src/compose';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import Layout, {Cell} from '@enact/ui/Layout';
import Popup from '@enact/agate/Popup';
import React from 'react';
import {TabbedPanels} from '@enact/agate/Panels';

import Clock from '../components/Clock';
import Home from '../views/Home';
import HVAC from '../views/HVAC';
import Phone from '../views/Phone';
import Settings from '../views/Settings';

import css from './App.less';

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
						{title: 'Phone', icon: 'funnel'},
						{title: 'HVAC', icon: 'play'}
					]}
				>
					<afterTabs>
						<Layout orientation="vertical" align="center space-evenly">
							<Cell shrink>
								<Clock />
							</Cell>
							<Cell shrink component={Button} type="grid" icon="fullscreen" small onTap={onSkinChange} />
						</Layout>
					</afterTabs>
					<Home
						onShowHVAC={onShowHVAC}
						onShowSettings={onShowSettings}
						onTogglePopup={onTogglePopup}
						onToggleBasicPopup={onToggleBasicPopup}
					/>
					<Phone />
					<HVAC />
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
					This is an example of a popup with a body section and a title. Plus there&apos;s buttons!
					<buttons>
						<Button>Enable Transport Mode</Button>
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
					Date and time pickers go here
					<buttons>
						<Button onTap={onToggleDateTimePopup}>Set Date & Time</Button>
					</buttons>
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
				skin: props.defaultSkin || 'carbon' // 'titanium' alternate.
			};
		}

		onSelect = handle(
			forward('onSelect'),
			({index}) => this.setState(state => state.index === index ? null : {index})
		).bind(this)

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

			return (
				<Wrapped
					{...props}
					index={this.state.index}
					onSelect={this.onSelect}
					onShowSettings={this.onShowSettings}
					onShowHVAC={this.onShowHVAC}
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
