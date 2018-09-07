import {Cell, Column, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import SwitchItem from '@enact/agate/SwitchItem';

import viewCss from './Settings.less';

const SwitchItemCell =  kind({
	name: 'SwitchItemCell',
	styles: {
		css: viewCss,
		className: 'switchItem'
	},
	computed: {
		className: ({css, noToggle, styler}) => styler.append(noToggle ? css.noToggle : '')
	},
	render: ({css, ...rest}) => {
		delete rest.noToggle;
		return (
			<Cell shrink>
				<SwitchItem css={css} {...rest} />
			</Cell>
		);
	}
});

const Settings = kind({
	name: 'Settings',
	styles: {
		css: viewCss,
		className: 'settingsView'
	},
	render: ({css, onToggleDateTimePopup, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit">
				<Cell />
				<Cell
					className={css.content}
					component={Column}
				>
					<Cell />
					<Cell
						className={css.header}
						component={Divider}
						shrink
						spacing="small"
					>
						Settings
					</Cell>
					<SwitchItemCell
						icon="star"
						noToggle
						onTap={onToggleDateTimePopup}
					>
						Date & Time
					</SwitchItemCell>
					<SwitchItemCell
						icon="bulletlist"
					>
						Bluetooth
					</SwitchItemCell>
					<SwitchItemCell
						icon="gear"
					>
						WiFi
					</SwitchItemCell>
					<SwitchItemCell
						icon="rollforward"
					>
						Turbo
					</SwitchItemCell>
					<SwitchItemCell
						icon="arrowlargeup"
						offText="disarmed"
						onText="armed"
					>
						Ejection Seat
					</SwitchItemCell>
					<Cell />
				</Cell>
				<Cell />
			</Row>
		</Panel>
	)
});

export default Settings;
