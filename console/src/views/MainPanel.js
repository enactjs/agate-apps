import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/moonstone/Panels';
import React from 'react';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Header title="Hello world!" />
			<Button>Click me</Button>
			<Button type="grid">Click me</Button>
		</Panel>
	)
});

export default MainPanel;
