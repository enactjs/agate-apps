import Button from '@enact/agate/Button';
import {Column, Cell} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

import Dialer from '../components/Dialer';

const Phone = kind({
	name: 'Phone',

	render: (props) => (
		<Panel {...props}>
			<Column align="center">
				<Cell shrink className="number-field">
					<span>user icon</span>
					<span>input</span>
				</Cell>
				<Cell className="dialer-grid">
					<Dialer align="center center" />
				</Cell>
				<Cell shrink className="call">
					<Button type="grid" highlighted style={{width: '300px'}}>Call</Button>
				</Cell>
			</Column>
		</Panel>
	)
});

export default Phone;
