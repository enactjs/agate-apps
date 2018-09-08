import Button from '@enact/agate/Button';
import {Cell, Row} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import React from 'react';

const CallPopup = kind({
	name: 'CallPopup',
	render: ({phoneNumber, onTogglePopup, ...rest}) => {
		return (
			<Popup {...rest}>
				<title>
					{`Your Friend (${phoneNumber})`}
				</title>
				<Row>
					<Cell />
					<Cell
						alt="Contact Image"
						component="img"
						shrink
						src="https://loremflickr.com/320/240/abstract"
					/>
					<Cell />
				</Row>
				<buttons>
					<Row>
						<Cell
							component={Button}
							icon="audio"
						/>
						<Cell
							component={Button}
							icon="plug"
						/>
						<Cell
							component={Button}
							icon="stop"
							onClick={onTogglePopup}
						/>
					</Row>
				</buttons>
			</Popup>
		);
	}
});

export default CallPopup;
