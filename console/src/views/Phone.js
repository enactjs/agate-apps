import Button from '@enact/agate/Button';
import Icon from '@enact/agate/Icon';
import Input from '@enact/agate/Input';
import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import VirtualList from '@enact/ui/VirtualList';
import ri from '@enact/ui/resolution';
import {Column, Cell} from '@enact/ui/Layout';
import {adaptEvent, forKey, forward, handle, oneOf} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import {ResponsiveBox} from '@enact/agate/DropManager';
import PropTypes from 'prop-types';
import React from 'react';

import CustomLayout, {SaveLayoutArrangement} from '../components/CustomLayout';
import Dialer from '../components/Dialer';
import CallPopup from '../components/CallPopup';
import ContactThumbnail from '../components/ContactThumbnail';
import AppContextConnect from '../App/AppContextConnect';

import css from './Phone.module.less';

const contacts = [
	{name: 'Blake',    number: '535-953-3185'},
	{name: 'Dave',     number: '659-170-1714'},
	{name: 'Derek',    number: '326-570-2555'},
	{name: 'Hailey',   number: '284-305-7508'},
	{name: 'Jason',    number: '716-208-2228'},
	{name: 'Jeremy',   number: '537-200-9353'},
	{name: 'Lis',      number: '809-203-3125'},
	{name: 'Lucy',     number: '473-349-4944'},
	{name: 'Roy',      number: '339-235-4561'},
	{name: 'Ryan',     number: '458-434-7850'},
	{name: 'Stephen',  number: '711-677-1166'},
	{name: 'Teck',     number: '133-427-7997'}
];

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

// eslint-disable-next-line enact/display-name, enact/prop-types
const renderContact = ({onContactClick}) => ({index, key, ...rest}) => (
	<ContactThumbnail
		// {...console.log('contact rest:', rest) ? {rel: 'test'} : null}
		{...rest}
		key={'contact' + key}
		className={css.contactItem}
		contact={contacts[index]}
		onSelect={onContactClick}
	/>
);

const ResponsiveVirtualList = ResponsiveBox(({containerShape, onContactClick, style = {}, ...rest}) => {
	// console.log('ResponsiveVirtualListBase containerShape:', containerShape);
	const portrait = (containerShape && containerShape.orientation === 'portrait');
	const orientation = (portrait ? 'vertical' : 'horizontal');
	if (!portrait) style.height = ri.scale(96);
	return (
		<VirtualList
			{...rest}
			direction={orientation}
			dataSize={contacts.length}
			itemRenderer={renderContact({onContactClick})}
			itemSize={ri.scale(portrait ? 96 : 300)}
			style={style}
		/>
	);
});

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
		sendTelemetry: PropTypes.func,
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
		onSelectDigit: handle(appendValue(ev => ev.value)),
		onClick: (ev, {sendTelemetry}) => {
			const time = new Date();
			time.setSeconds(time.getSeconds() - 1);
			sendTelemetry({
				appInstanceId: 'phone',
				appName: 'phone',
				featureName: 'Call',
				status: 'Running',
				appStartTime: time,
				intervalFlag: false
			});
		}
	},

	render: ({arrangeable, arrangement, onArrange, handleInputKeyDown, onContactClick, onChange, onClear, onClick, onSelectDigit, onTogglePopup, showPopup, value, ...rest}) => {
		delete rest.sendTelemetry;
		return (
			<Panel {...rest}>
				<CustomLayout arrangeable={arrangeable} arrangement={arrangement} onArrange={onArrange}>
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
							<Icon onClick={onClear} css={css} >arrowshrink</Icon>
						</Cell>
						<Cell className="dialer-grid">
							<Dialer align="center center" onSelectDigit={onSelectDigit} />
						</Cell>
						<Cell shrink className="call" onClick={onClick}>
							<Button
								className={css.callButton}
								disabled={!value}
								onClick={onTogglePopup}
								type="grid"
								highlighted
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
					<bottom>
						<div className={css.scrollableContainer}>
							<ResponsiveVirtualList
								className={css.contactsList}
								onContactClick={onContactClick}
							/>
						</div>
					</bottom>
				</CustomLayout>
			</Panel>
		);
	}
});

const Phone = AppContextConnect(({sendTelemetry}) => ({
	sendTelemetry
}))(Toggleable(
	{prop: 'showPopup', toggle: 'onTogglePopup'},
	Changeable(
		SaveLayoutArrangement('phone')(
			PhoneBase
		)
	)
));

export default Phone;
