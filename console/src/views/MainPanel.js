import Button from '@enact/agate/Button';
import {Cell, Column} from '@enact/ui/Layout';
import Icon from '@enact/agate/Icon';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

import Phone from './Phone';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Column>
				<Cell shrink>
					<Icon>fullscreen</Icon>
					<Button icon="fullscreen" />
					<Button icon="fullscreen" type="grid" />
					<Button icon="fullscreen" type="grid">Click me</Button>
					<Button icon="fullscreen">Click me</Button>
					<Button>Click me</Button>
					<Button type="grid">Click me</Button>
				</Cell>
				<Cell component={Phone} />
			</Column>
		</Panel>
	)
});

export default MainPanel;
