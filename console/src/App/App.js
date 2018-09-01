import AgateDecorator from '@enact/agate/AgateDecorator';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import compose from 'ramda/src/compose';
import React from 'react';
// import {adaptEvent, forward, handle} from '@enact/core/handle';
import Button from '@enact/agate/Button';
// import Skinnable from '@enact/agate/Skinnable';
import {TabbedPanels} from '@enact/agate/Panels';

import Home from '../views/Home';
import Phone from '../views/Phone';
import MainPanel from '../views/MainPanel';

import css from './App.less';

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	// computed: {
	// 	orientation: ({skin}) => (skin === 'titanium' ? 'horizontal' : 'vertical')
	// },

	// handlers: {
	// 	onSelect: handle(
	// 		// this should probably be done in TabbedPanels to line up the event payload (index)
	// 		// with the prop but i'm taking a shortcut for now
	// 		adaptEvent(({selected}) => ({index: selected}), forward('onSelect'))
	// 	)
	// },

	render: ({onSkinChange, ...rest}) => {
		// delete rest.skin;
		return (
			<TabbedPanels
				{...rest}
				// orientation="vertical"
				// tabPosition="after"
				tabs={[
					{title: 'Home', icon: 'denselist', view: Home},
					{title: 'Phone', icon: 'funnel', view: Phone},
					{title: 'Hello!', icon: 'search', view: MainPanel}
				]}
			>
				<afterTabs>
					<Button type="grid" icon="fullscreen" small onTap={onSkinChange} />
				</afterTabs>
			</TabbedPanels>
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
		render () {
			const props = {...this.props};
			delete props.defaultIndex;
			return(
				<Wrapped
					{...props}
					index={this.state.index}
					onSelect={this.onSelect}
					onSkinChange={this.onSkinChange}
					skin={this.state.skin}
					orientation={(this.state.skin === 'titanium') ? 'horizontal' : 'vertical'}
				/>
			);
		}
	}
});

const AppDecorator = compose(
	AppState,
	AgateDecorator
	// Skinnable,
);

const App = AppDecorator(AppBase);

export default App;
