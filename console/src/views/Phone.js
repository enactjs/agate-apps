import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';

import css from './Phone.less';

const Phone = kind({
	name: 'Phone',

	styles: {
		css,
		className: 'phone'
	},

	render: (props) => (
		<Column {...props} align="center">
			<Cell shrink className="number-field">
				<span>user icon</span>
				<span>input</span>
			</Cell>
			<Cell className="dialer-grid">
				<Column>
					<Cell>
						<Row align="center center">
							<Cell shrink component={Button} type="grid">1</Cell>
							<Cell shrink component={Button} type="grid" data-subtitle="ABC">2</Cell>
							<Cell shrink component={Button} type="grid" data-subtitle="DEF">3</Cell>
						</Row>
					</Cell>
					<Cell>
						<Row align="center center">
							<Cell shrink component={Button} type="grid" data-subtitle="GHI">4</Cell>
							<Cell shrink component={Button} type="grid" data-subtitle="JKL">5</Cell>
							<Cell shrink component={Button} type="grid" data-subtitle="MNO">6</Cell>
						</Row>
					</Cell>
					<Cell>
						<Row align="center center">
							<Cell shrink component={Button} type="grid" data-subtitle="PQRS">7</Cell>
							<Cell shrink component={Button} type="grid" data-subtitle="TUV">8</Cell>
							<Cell shrink component={Button} type="grid" data-subtitle="WXYZ">9</Cell>
						</Row>
					</Cell>
					<Cell>
						<Row align="center center">
							<Cell shrink component={Button} type="grid">*</Cell>
							<Cell shrink component={Button} type="grid" data-subtitle="+">0</Cell>
							<Cell shrink component={Button} type="grid">#</Cell>
						</Row>
					</Cell>
				</Column>
			</Cell>
			<Cell shrink className="call">
				<Button type="grid" highlighted style={{width: '300px'}}>Call</Button>
			</Cell>
		</Column>
	)
});

export default Phone;
