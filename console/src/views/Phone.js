import Button from '@enact/agate/Button';
import Input from '@enact/agate/Input';
import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import {Column, Cell} from '@enact/ui/Layout';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import PropTypes from 'prop-types';
import React from 'react';

import Dialer from '../components/Dialer';
import CallPopup from '../components/CallPopup';

const PhoneBase = kind({
	name: 'Phone',

	propTypes: {
		onChange: PropTypes.func,
		onTogglePopup: PropTypes.func,
		showPopup: PropTypes.bool,
		value: PropTypes.string
	},

	defaultProps: {
		value: ''
	},

	handlers: {
		onClear: handle(
			adaptEvent(
				(ev, {value}) => ({value: value ? value.substring(0, value.length - 1) : ''}),
				forward('onChange')
			)
		),
		onSelectDigit: handle(
			adaptEvent(
				({value: digit}, {value}) => ({value: `${value}${digit}`}),
				forward('onChange')
			)
		)
	},

	render: ({onChange, onClear, onSelectDigit, onTogglePopup, showPopup, value, ...rest}) => (
		<Panel {...rest}>
			<Column align="center">
				<Cell shrink className="number-field">
					<span>user icon</span>
					<Input
						onChange={onChange}
						placeholder="Phone Number ..."
						type="number"
						value={value}
					/>
					<Button small icon="\u232B" onClick={onClear} />
				</Cell>
				<Cell className="dialer-grid">
					<Dialer align="center center" onSelectDigit={onSelectDigit} />
				</Cell>
				<Cell shrink className="call">
					<Button
						disabled={!value}
						onClick={onTogglePopup}
						type="grid"
						highlighted
						style={{width: '300px'}}
					>
						Call
					</Button>
				</Cell>
			</Column>
			<CallPopup
				contactName=""
				onCallEnd={onTogglePopup}
				open={showPopup}
				phoneNumber={value}
			/>
		</Panel>
	)
});

const Phone = Toggleable(
	{prop: 'showPopup', toggle: 'onTogglePopup'},
	Changeable(
		PhoneBase
	)
);

export default Phone;
