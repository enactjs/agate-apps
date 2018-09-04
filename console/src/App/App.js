import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import compose from 'ramda/src/compose';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import React from 'react';
import {TabbedPanels} from '@enact/agate/Panels';

import Home from '../views/Home';
import Phone from '../views/Phone';
import MainPanel from '../views/MainPanel';

import {CenteredPopupMessage} from '../components/PopupMessage';

import css from './App.less';

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: ({onSkinChange, onTogglePopup, showPopup, skinName, ...rest}) => {
		return (
			<div>
				<TabbedPanels
					{...rest}
					// orientation="vertical"
					// tabPosition="after"
					tabs={[
						{title: 'Home', icon: 'denselist', view: Home, viewProps: {
							onTogglePopup
						}},
						{title: 'Phone', icon: 'funnel', view: Phone},
						{title: 'Hello!', icon: 'search', view: MainPanel}
					]}
				>
					<afterTabs>
						<Button type="grid" icon="fullscreen" small onTap={onSkinChange} />
					</afterTabs>
				</TabbedPanels>
				<Popup
					open={showPopup}
				>
					<CenteredPopupMessage onClick={onTogglePopup}>
						{`Popup for ${skinName} skin`}
					</CenteredPopupMessage>
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
					showPopup={this.state.showPopup}
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
