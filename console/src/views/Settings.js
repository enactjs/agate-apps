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
		onSelect: (ev, {onSelect}) => {
			onSelect({selected: ev.currentTarget.dataset.tabindex});
		}
	},

	render: ({css, onSelect, onToggleDateTimePopup, ...rest}) => {
		delete rest.onUserSettingsChange;

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
							<SliderButton>{[
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
