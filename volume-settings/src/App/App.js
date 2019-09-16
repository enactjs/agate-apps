import AgateDecorator from '@enact/agate/AgateDecorator';
import Panels from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import React from 'react';

import MainPanel from '../views/MainPanel';

import css from './App.module.less';

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => (
		<Panels {...props} noCloseButton>
			<MainPanel />
		</Panels>
	)
});

export default AgateDecorator(App);
