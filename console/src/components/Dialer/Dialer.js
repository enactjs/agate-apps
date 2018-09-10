import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';

import css from './Dialer.less';

const Digit = kind({
	name: 'Digit',

	handlers: {
		onSelect: (ev, {children, onSelect}) => onSelect && onSelect({
			type: 'onSelect',
			value: children
		})
	},

	render: ({children, onSelect, subtitle, ...rest}) => {
		return (
			<Cell shrink component={Button} type="grid" data-subtitle={subtitle} {...rest} onClick={onSelect}>
				{children}
			</Cell>
		);
	}
});

const Dialer = kind({
	name: 'Dialer',

	styles: {
		css,
		className: 'dialer'
	},

	render: ({onSelectDigit, ...rest}) => (
		<Column {...rest}>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit onSelect={onSelectDigit}>1</Digit>
					<Digit subtitle="ABC" onSelect={onSelectDigit}>2</Digit>
					<Digit subtitle="DEF" onSelect={onSelectDigit}>3</Digit>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit subtitle="GHI" onSelect={onSelectDigit}>4</Digit>
					<Digit subtitle="JKL" onSelect={onSelectDigit}>5</Digit>
					<Digit subtitle="MNO" onSelect={onSelectDigit}>6</Digit>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit subtitle="PQRS" onSelect={onSelectDigit}>7</Digit>
					<Digit subtitle="TUV" onSelect={onSelectDigit}>8</Digit>
					<Digit subtitle="WXYZ" onSelect={onSelectDigit}>9</Digit>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit onSelect={onSelectDigit}>*</Digit>
					<Digit subtitle="+" onSelect={onSelectDigit}>0</Digit>
					<Digit onSelect={onSelectDigit}>#</Digit>
				</Row>
			</Cell>
		</Column>
	)
});

export default Dialer;
export {
	Dialer
};
