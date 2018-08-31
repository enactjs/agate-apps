import AgateDecorator from '@enact/agate/AgateDecorator';
import kind from '@enact/core/kind';
import React from 'react';
import {TabbedPanels} from '@enact/agate/Panels';

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

	render: (props) => (
		<TabbedPanels
			{...props}
			orientation="vertical"
			// tabPosition="after"
			tabs={[
				{title: 'Home', view: Home},
				{title: 'Phone', view: Phone},
				{title: 'HVAC', view: HVAC},
				{title: 'Hello!', view: MainPanel}
			]}
		/>
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
	render () {
		const props = Object.assign({}, this.props);
		props.index = this.state.index;
		props.onSelect = this.onSelect;

		return(
			<AppBase {...props} />
		);
	}
}

export default AgateDecorator(App);
