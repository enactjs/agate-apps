import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';

const Phone = kind({
	name: 'Phone',

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
							<Cell shrink component={Button} type="grid">2</Cell>
							<Cell shrink component={Button} type="grid">3</Cell>
						</Row>
					</Cell>
					<Cell>
						<Row align="center center">
							<Cell shrink component={Button} type="grid">4</Cell>
							<Cell shrink component={Button} type="grid">5</Cell>
							<Cell shrink component={Button} type="grid">6</Cell>
						</Row>
					</Cell>
					<Cell>
						<Row align="center center">
							<Cell shrink component={Button} type="grid">7</Cell>
							<Cell shrink component={Button} type="grid">8</Cell>
							<Cell shrink component={Button} type="grid">9</Cell>
						</Row>
					</Cell>
					<Cell>
						<Row align="center center">
							<Cell shrink component={Button} type="grid">*</Cell>
							<Cell shrink component={Button} type="grid">0</Cell>
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
