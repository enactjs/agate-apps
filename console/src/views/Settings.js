import {Cell, Column, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import LabeledItem from '@enact/agate/LabeledItem';
import SwitchItem from '@enact/agate/SwitchItem';

import NetworkInfo from '../../../components/NetworkInfo';
import viewCss from './Settings.module.less';
import {getPanelIndexOf} from '../App';

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
			onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
		}
	},

	render: ({css, ipAddress, onSelect, onToggleDateTimePopup, onReloadApp, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit" align=" center">
				<Cell size="40%">
					<Column className={css.content}>
						<Cell
							className={css.header}
							component={Divider}
							shrink
							spacing="none"
						>
							Settings
						</Cell>
						<SwitchItemCell
							icon="edit"
							noToggle
							data-tabindex={getPanelIndexOf('settings/theme')}
							onClick={onSelect}
						>
							Theme
						</SwitchItemCell>
						<SwitchItemCell
							icon="datetime"
							noToggle
							onClick={onToggleDateTimePopup}
						>
							Date & Time
						</SwitchItemCell>
						<SwitchItemCell
							icon="bluetooth"
						>
							Bluetooth
						</SwitchItemCell>
						<SwitchItemCell
							icon="wifi"
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
						<SwitchItemCell
							noToggle
							onClick={onReloadApp}
						>
							Reload Apps
						</SwitchItemCell>
						<LabeledItem label={ipAddress}>IP Address</LabeledItem>
					</Column>
				</Cell>
			</Row>
		</Panel>
	)
});

export default NetworkInfo(Settings);
