import Button from '@enact/agate/Button';
import Popup from '@enact/agate/Popup';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Cell, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import css from './CallPopup.less';

const forwardSimpleEvent = type => handle(adaptEvent(() => ({type}), forward(type)));

const CallPopup = kind({
	name: 'CallPopup',
	propTypes: {
		phoneNumber: PropTypes.string.isRequired,
		contactName: PropTypes.string,
		onCallEnd: PropTypes.func
	},

	styles: {
		css,
		className: 'callPopup'
	},

	handlers: {
		onCallEnd: forwardSimpleEvent('onCallEnd')
	},

	computed: {
		title: ({contactName, phoneNumber}) => {
			if (contactName && phoneNumber) {
				return `${contactName} (${phoneNumber})`
			}

			return phoneNumber;
		}
	},

	render: ({onCallEnd, title, ...rest}) => {
		delete rest.contactName;
		delete rest.phoneNumber;

		return (
			<Popup {...rest} title={title}>
				<Row>
					<Cell />
					<Cell
						component="img"
						className={css.contactPhoto}
						alt="Contact Image"
						shrink
						src="https://loremflickr.com/240/240/abstract"
					/>
					<Cell />
				</Row>
				<Row className={css.icons} slot="buttons">
					<Button icon="audio" />
					<Button icon="plug" />
					<Button icon="stop" onClick={onCallEnd} />
				</Row>
			</Popup>
		);
	}
});

export default CallPopup;
