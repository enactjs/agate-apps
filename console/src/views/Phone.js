
import Button from '@enact/agate/Button';
import Input from '@enact/agate/Input';
import Changeable from '@enact/ui/Changeable';
import Scroller from '@enact/ui/Scroller';
import Icon from '@enact/agate/Icon';
import {Column, Cell} from '@enact/ui/Layout';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import PropTypes from 'prop-types';
import React from 'react';

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
	},
]

const PhoneBase = kind({
	name: 'Phone',
	styles: {
		css,
		className: 'phone'
	},

	propTypes: {
		onChange: PropTypes.func,
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
		),
		onContactClick: handle(
			adaptEvent(
				(value) => ({value}),
				forward('onChange')
			)
		),
	},


	render: ({onChange, onClear, onSelectDigit, onContactClick, value, ...rest}) => {
		const	contactList = contacts.map(contact => {
			return (
				<ContactThumbnail
					contact={contact}
					onClick={onContactClick} />
			);
		})
		return (
			<Panel {...rest}>
				<Column align="center">
					<Cell shrink className="number-field">
						<Icon>user</Icon>
						<Input
							onChange={onChange}
							placeholder="Phone Number ..."
							value={value}
						/>
						<Icon onClick={onClear} css={css} >{"\u232B"}</Icon>
					</Cell>
					<Cell className={css.dialer}>
						<Dialer align="center center" onSelectDigit={onSelectDigit} />
					</Cell>
					<Cell shrink className="call">
						<Button type="grid" highlighted style={{width: '300px'}}>Call</Button>
					</Cell>
					<Cell
						component={Scroller}
						shrink
						className={css.contactsList}
						direction="horizontal"
					>
						{contactList}
					</Cell>
				</Column>
			</Panel>
		)
	}
});

const Phone = Changeable(PhoneBase);

export default Phone;
