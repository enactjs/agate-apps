import Button from '@enact/agate/Button';
import Icon from '@enact/agate/Icon';
import Input from '@enact/agate/Input';
import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import {Column, Cell} from '@enact/ui/Layout';
import Scroller from '@enact/ui/Scroller';
import {adaptEvent, forKey, forward, handle, oneOf} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import PropTypes from 'prop-types';
import React from 'react';

import CallPopup from '../components/CallPopup';
import Dialer from '../components/Dialer';
import ContactThumbnail from '../components/ContactThumbnail';
import css from './Phone.less';

const contacts = [
	{
		name: 'Hailey',
		number:  '650 476 9240'
	},
	{
		name: 'Tree',
		number:  '650 476 9240'
	},
	{
		name: 'React',
		number:  '650 476 9240'
	},
	{
		name: 'JavaScript',
		number:  '650 476 9240'
	},
	{
		name: 'Goo',
		number:  '650 476 9240'
	},
]

const forwardClear = adaptEvent(
	(ev, {value}) => ({value: value ? value.substring(0, value.length - 1) : ''}),
	forward('onChange')
);

const isFromDecorator = ({target}) => target.nodeName !== 'INPUT';

const isDigit = ({keyCode}) => keyCode >= 48 && keyCode <= 57;
const appendValue = appender => adaptEvent(
	(ev, {value}) => ({value: `${value}${appender(ev)}`}),
	forward('onChange')
);

const PhoneBase = kind({
	name: 'Phone',
	styles: {
		css,
		className: 'phone'
	},

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
		handleInputKeyDown: handle(
			isFromDecorator,
			oneOf(
				[forKey('backspace'), forwardClear],
				[isDigit, appendValue(ev => ev.keyCode - 48)]
			)
		),
		onClear: handle(forwardClear),
		onSelectDigit: handle(appendValue(ev => ev.value))
	},

	render: ({handleInputKeyDown, onChange, onClear, onSelectDigit, onTogglePopup, showPopup, value, ...rest}) => {
		const	contactList = contacts.map(contact => <ContactThumbnail contact={contact}/>)
		return (
		<Panel {...rest}>
			<Column align="center">
				<Cell shrink className="number-field">
					<Icon>user</Icon>
					<Input
						dismissOnEnter
						onKeyDown={handleInputKeyDown}
						onChange={onChange}
						placeholder="Phone Number ..."
						type="number"
						value={value}
					/>
					<Icon onClick={onClear} small>\u232B</Icon>
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
				<Cell shrink className="contacts-cell">
					<Scroller className="" direction="horizontal">
						<div className={css.contacts}>{contactList}</div>
					</Scroller>
				</Cell>
			</Column>
			<CallPopup
				contactName=""
				onCallEnd={onTogglePopup}
				open={showPopup}
				phoneNumber={value}
			/>
		</Panel>
	)}
});

const Phone = Toggleable(
	{prop: 'showPopup', toggle: 'onTogglePopup'},
	Changeable(
		PhoneBase
	)
);

export default Phone;
