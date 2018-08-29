import Button from '@enact/agate/Button';
import Icon from '@enact/agate/Icon';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/moonstone/Panels';
import React from 'react';

import Phone from './Phone';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Header title="Hello world!">
				<Icon>fullscreen</Icon>
				<Button icon="fullscreen" />
				<Button icon="fullscreen" type="grid" />
				<Button icon="fullscreen" type="grid">Click me</Button>
				<Button icon="fullscreen">Click me</Button>
				<Button>Click me</Button>
				<Button type="grid">Click me</Button>
			</Header>

			<Phone />
		</Panel>
	)
});

export default MainPanel;
