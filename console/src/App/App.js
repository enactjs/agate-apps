import AgateDecorator from '@enact/agate/AgateDecorator';
import kind from '@enact/core/kind';
import React from 'react';
import {TabbedPanels} from '@enact/agate/Panels';

import MainPanel from '../views/MainPanel';

import css from './App.less';

const divTest = (props) => <div {...props} />;

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => (
		<TabbedPanels
			{...props}
			tabOrientation="vertical"
			tabs={[
				{title: 'Main Panel', view: MainPanel},
				{title: 'Tab 1', view: divTest, viewProps: {
					children: 'View 1'
				}},
				{title: 'Tab 2', view: divTest, viewProps: {
					children: 'View 2'
				}}
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
