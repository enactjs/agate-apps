import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {TabbedPanels} from '@enact/agate/Panels';
import Popup from '@enact/agate/Popup';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import Layout, {Cell} from '@enact/ui/Layout';
import compose from 'ramda/src/compose';
import React from 'react';

import Clock from '../components/Clock';
import Home from '../views/Home';
import HVAC from '../views/HVAC';
import Phone from '../views/Phone';

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

	render: ({onSkinChange, onTogglePopup, onToggleBasicPopup, showPopup, showBasicPopup, skinName, ...rest}) => {
		return (
			<div>
				<TabbedPanels
					{...rest}
					// tabPosition="after"
					tabs={[
						{title: 'Home', icon: 'denselist', view: Home, viewProps: {
							onTogglePopup,
							onToggleBasicPopup
						}},
						{title: 'Phone', icon: 'funnel', view: Phone},
						{title: 'HVAC', icon: 'play', view: HVAC}
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

		onSkinChange = () => {
			this.setState(({skin}) => ({skin: (skin === 'carbon' ? 'titanium' : 'carbon')}));
		}

		onTogglePopup = () => {
			this.setState(({showPopup}) => ({showPopup: !showPopup}));
		}

		onToggleBasicPopup = () => {
			this.setState(({showBasicPopup}) => ({showBasicPopup: !showBasicPopup}));
		}

		render () {
			const props = {...this.props};

			delete props.defaultIndex;

			return (
				<Wrapped
					{...props}
					index={this.state.index}
					onSelect={this.onSelect}
					onSkinChange={this.onSkinChange}
					onTogglePopup={this.onTogglePopup}
					onToggleBasicPopup={this.onToggleBasicPopup}
					orientation={(this.state.skin === 'titanium') ? 'horizontal' : 'vertical'}
					showPopup={this.state.showPopup}
					showBasicPopup={this.state.showBasicPopup}
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
