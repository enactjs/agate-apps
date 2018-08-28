import kind from '@enact/core/kind';
import AgateDecorator from '@enact/agate/AgateDecorator';
import React from 'react';

import MainPanel from '../views/MainPanel';

import css from './App.less';

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => (
		<div {...props}>
			<MainPanel />
		</div>
	)
});

export default AgateDecorator(App);
