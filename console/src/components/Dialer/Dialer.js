import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';

import css from './Dialer.less';

const Dialer = kind({
	name: 'Dialer',

	styles: {
		css,
		className: 'dialer'
	},

	handlers: {
		onClick: (ev, {onChange}) => {
			if (onChange) {
				const value = ev.target.innerText || ev.target.nextSibling.innerText;
				onChange(value);
			}
		}
	},

	render: ({onClick, ...props}) => (
		<Column {...props}>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Cell shrink component={Button} onClick={onClick} type="grid">1</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="ABC">2</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="DEF">3</Cell>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="GHI">4</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="JKL">5</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="MNO">6</Cell>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="PQRS">7</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="TUV">8</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="WXYZ">9</Cell>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Cell shrink component={Button} onClick={onClick} type="grid">*</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid" data-subtitle="+">0</Cell>
					<Cell shrink component={Button} onClick={onClick} type="grid">#</Cell>
				</Row>
			</Cell>
		</Column>
	)
});

export default Dialer;
