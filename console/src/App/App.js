import AgateDecorator from '@enact/agate/AgateDecorator';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
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

	handlers: {
		onSelect: handle(
			// this should probably be done in TabbedPanels to line up the event payload (index)
			// with the prop but i'm taking a shortcut for now
			adaptEvent(({selected}) => ({index: selected}), forward('onSelect'))
		)
	},

	render: (props) => (
		<TabbedPanels
			{...props}
			orientation="vertical"
			// tabPosition="after"
			tabs={[
				{title: 'Home', view: Home},
				{title: 'Phone', view: Phone},
				{title: 'Hello!', view: MainPanel}
			]}
		/>
	)
});

const App = AgateDecorator(
	Changeable(
		{change: 'onSelect', prop: 'index'},
		AppBase
	)
);

export default App;
