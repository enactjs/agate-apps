import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import Popup from '@enact/agate/Popup';
import compose from 'ramda/src/compose';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import Layout, {Cell} from '@enact/ui/Layout';
import {TabbedPanels} from '@enact/agate/Panels';

import Clock from '../components/Clock';
import Home from '../views/Home';
import HVAC from '../views/HVAC';
import Phone from '../views/Phone';
import MainPanel from '../views/MainPanel';

import css from './App.less';

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: ({onSkinChange, onTogglePopup, onToggleBasicPopup, showPopup, showBasicPopup, skinName, ...rest}) => {
		return (
			<div>
				<TabbedPanels
					{...rest}
					// orientation="vertical"
					// tabPosition="after"
					tabs={[
						{title: 'Home', icon: 'denselist', view: Home, viewProps: {
							onTogglePopup,
							onToggleBasicPopup
						}},
						{title: 'Phone', icon: 'funnel', view: Phone},
						{title: 'HVAC', icon: 'play', view: HVAC},
						{title: 'Hello!', icon: 'search', view: MainPanel}
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
				index: props.defaultIndex || props.index || 0,
				showPopup: false,
				showBasicPopup: false,
				skin: props.skin || 'carbon' // 'titanium' alternate.
			};
		}
		onSelect = (ev) => {
			const {selected: index} = ev;
			if (typeof index === 'number' && index !== this.state.index) {
				this.setState({index});
			}
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
		render () {
			const props = {...this.props};
			delete props.defaultIndex;
			return(
				<Wrapped
					{...props}
					index={this.state.index}
					onSelect={this.onSelect}
					onSkinChange={this.onSkinChange}
					onTogglePopup={this.onTogglePopup}
					onToggleBasicPopup={this.onToggleBasicPopup}
					showPopup={this.state.showPopup}
					showBasicPopup={this.state.showBasicPopup}
					skin={this.state.skin}
					skinName={this.state.skin}
					orientation={(this.state.skin === 'titanium') ? 'horizontal' : 'vertical'}
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
