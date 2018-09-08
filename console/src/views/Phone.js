import Button from '@enact/agate/Button';
import Input from '@enact/agate/Input';
import Changeable from '@enact/ui/Changeable';
import {Column, Cell} from '@enact/ui/Layout';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import PropTypes from 'prop-types';
import React from 'react';

import {CallPopup, Dialer} from '../components/Dialer';

const PhoneBase = kind({
	name: 'Phone',

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
					<Button onClick={onTogglePopup} type="grid" highlighted style={{width: '300px'}}>Call</Button>
				</Cell>
			</Column>
			<CallPopup
				onTogglePopup={onTogglePopup}
				open={showPopup}
				phoneNumber={value}
			/>
		</Panel>
	)
});

class PhoneState extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPopup: this.props.showPopup
		};
	}
	onTogglePopup = () => {
		this.setState(({showPopup}) => ({showPopup: !showPopup}));
	};
	render () {
		const props = Object.assign({}, this.state, this.props);
		props.onTogglePopup = this.onTogglePopup;
		return (
			<PhoneBase {...props} />
		);
	}
}

const Phone = Changeable(PhoneState);

export default Phone;
