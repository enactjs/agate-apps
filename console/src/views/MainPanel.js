import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/moonstone/Panels';
import React from 'react';

import Phone from './Phone';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Header title="Hello world!">
				<Button>Click me</Button>
				<Button type="grid">Click me</Button>
			</Header>

			<Phone />
		</Panel>
	)
});

export default MainPanel;
