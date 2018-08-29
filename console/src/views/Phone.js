import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Column, Cell} from '@enact/ui/Layout';
import React from 'react';

import Dialer from '../components/Dialer';

const Phone = kind({
	name: 'Phone',

	render: (props) => (
		<Column {...props} align="center">
			<Cell shrink className="number-field">
				<span>user icon</span>
				<span>input</span>
			</Cell>
			<Cell className="dialer-grid">
				<Dialer />
			</Cell>
			<Cell shrink className="call">
				<Button type="grid" highlighted style={{width: '300px'}}>Call</Button>
			</Cell>
		</Column>
	)
});

export default Phone;
