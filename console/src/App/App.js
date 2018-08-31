import AgateDecorator from '@enact/agate/AgateDecorator';
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

	render: ({onTogglePopup, showPopup, ...rest}) => (
		<div>
			<TabbedPanels
				{...rest}
				orientation="vertical"
				// tabPosition="after"
				tabs={[
					{title: 'Home', view: Home, viewProps: {
						onTogglePopup
				}},
					{title: 'Phone', view: Phone},
					{title: 'Hello!', view: MainPanel}
				]}
			/>
			<Popup
				open={showPopup}
			>
				<CenteredPopupMessage onClick={onTogglePopup}>
					HELLO!
				</CenteredPopupMessage>
			</Popup>
		</div>
	)
});

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			index: props.index || 0
		};
	}
	onSelect = (ev) => {
		const {selected: index} = ev;
		if (typeof index === 'number' && index !== this.state.index) {
			this.setState({index});
		}
	};
	onTogglePopup = () => {
		this.setState(prevState => ({showPopup: !prevState.showPopup}));
	};
	render () {
		const props = Object.assign({}, this.props);
		props.index = this.state.index;
		props.onSelect = this.onSelect;
		props.onTogglePopup = this.onTogglePopup;
		props.showPopup = this.state.showPopup;

		return(
			<AppBase {...props} />
		);
	}
}

export default AgateDecorator(App);
