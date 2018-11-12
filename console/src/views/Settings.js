import {Cell, Column, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import LabeledItem from '@enact/agate/LabeledItem';
import SwitchItem from '@enact/agate/SwitchItem';

import NetworkInfo from '../../../components/NetworkInfo';
import viewCss from './Settings.less';
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

	render: ({css, ipAddress, onSelect, onToggleDateTimePopup, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit" align=" center">
				<Cell size="40%">
					<Column className={css.content}>
						<Cell
							className={css.header}
							component={Divider}
							shrink
							spacing="small"
						>
							Settings
						</Cell>
						<SwitchItemCell
							icon="user"
							noToggle
							data-tabindex={getPanelIndexOf('settings/display')}
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
						<LabeledItem label={ipAddress}>IP Address</LabeledItem>
					</Column>
				</Cell>
			</Row>
		</Panel>
	)
});

export default NetworkInfo(Settings);
