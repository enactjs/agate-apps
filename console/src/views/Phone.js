
import Button from '@enact/agate/Button';
import Icon from '@enact/agate/Icon';
import Input from '@enact/agate/Input';
import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import Scroller from '@enact/ui/Scroller';
import {Column, Cell} from '@enact/ui/Layout';
import {adaptEvent, forKey, forward, handle, oneOf} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import PropTypes from 'prop-types';
import React from 'react';

import Dialer from '../components/Dialer';
import CallPopup from '../components/CallPopup';
import ContactThumbnail from '../components/ContactThumbnail';
import css from './Phone.less';

const contacts = [
	{
		name: 'Hailey',
		number:  '011 006 1987'
	},
	{
		name: 'Tree',
		number:  '111 111 1111'
	},
	{
		name: 'React',
		number:  '222 222 2222'
	},
	{
		name: 'JavaScript',
		number:  '333 333 3333'
	},
	{
		name: 'Goo',
		number:  '444 444 4444'
	}
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
		onContactClick: handle(
			adaptEvent(
				({contact}) => ({value: contact.number.replace(/ /g, '')}),
				forward('onChange')
			)
		),
		onClear: handle(forwardClear),
		onSelectDigit: handle(appendValue(ev => ev.value))
	},


	render: ({handleInputKeyDown, onContactClick, onChange, onClear, onSelectDigit, onTogglePopup, showPopup, value, ...rest}) => {
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
							value={value}
						/>
						<Icon onClick={onClear} css={css} >\u232B</Icon>
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
					<Cell
						component={Scroller}
						shrink
						className={css.contactsList}
						direction="horizontal"
					>
						{contacts.map(contact => (
							<ContactThumbnail
								key={contact.name}
								contact={contact}
								onSelect={onContactClick}
							/>
						))}
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
	}
});

const Phone = Toggleable(
	{prop: 'showPopup', toggle: 'onTogglePopup'},
	Changeable(
		PhoneBase
	)
);

export default Phone;
