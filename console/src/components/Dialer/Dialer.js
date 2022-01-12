import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';

import css from './Dialer.module.less';

const Digit = kind({
	name: 'Digit',

	propTypes: {
		onSelect: PropTypes.func,
		subtitle: PropTypes.string
	},

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

	propTypes: {
		onSelectDigit: PropTypes.func
	},

	styles: {
		css,
		className: 'dialer'
	},

	render: ({onSelectDigit, ...rest}) => (
		<Column {...rest}>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit className={css.digit} onSelect={onSelectDigit}>1</Digit>
					<Digit className={css.digit} subtitle="ABC" onSelect={onSelectDigit}>2</Digit>
					<Digit className={css.digit} subtitle="DEF" onSelect={onSelectDigit}>3</Digit>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit className={css.digit} subtitle="GHI" onSelect={onSelectDigit}>4</Digit>
					<Digit className={css.digit} subtitle="JKL" onSelect={onSelectDigit}>5</Digit>
					<Digit className={css.digit} subtitle="MNO" onSelect={onSelectDigit}>6</Digit>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit className={css.digit} subtitle="PQRS" onSelect={onSelectDigit}>7</Digit>
					<Digit className={css.digit} subtitle="TUV" onSelect={onSelectDigit}>8</Digit>
					<Digit className={css.digit} subtitle="WXYZ" onSelect={onSelectDigit}>9</Digit>
				</Row>
			</Cell>
			<Cell shrink className={css.row}>
				<Row align="center center">
					<Digit className={css.digit} onSelect={onSelectDigit}>*</Digit>
					<Digit className={css.digit} subtitle="+" onSelect={onSelectDigit}>0</Digit>
					<Digit className={css.digit} onSelect={onSelectDigit}>#</Digit>
				</Row>
			</Cell>
		</Column>
	)
});

export default Dialer;
export {
	Dialer
};
