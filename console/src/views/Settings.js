import {adaptEvent, forward, handle} from '@enact/core/handle';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import SwitchItem from '@enact/agate/SwitchItem';
import SliderButton from '@enact/agate/SliderButton';

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

	handlers: {
		onSelect: handle(
			adaptEvent((ev) => ({index: Number(ev.currentTarget.dataset.tabindex)}), forward('onSelect'))
		),
		onUserChange: handle(
			adaptEvent(({value}) => ({userId: value + 1}), forward('onUserSettingsChange'))
		)
	},

	computed: {
		userId: ({settings}) => settings.userId - 1
	},

	render: ({css, onSelect, onToggleDateTimePopup, onUserChange, userId, ...rest}) => {
		delete rest.onUserSettingsChange;
		delete rest.settings;

		return (
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
						<Cell>
							<SliderButton onChange={onUserChange} value={userId}>{[
								'User 1',
								'User 2'
							]}</SliderButton>
						</Cell>
						<SwitchItemCell
							icon="user"
							noToggle
							data-tabindex={4}
							onTap={onSelect}
						>
							Display
						</SwitchItemCell>
						<SwitchItemCell
							icon="ellipsis"
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
							icon="fan"
						>
							Turbo
						</SwitchItemCell>
						<SwitchItemCell
							icon="heatseatright"
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
	}
});

export default Settings;
