import {Cell, Column, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import SwitchItem from '@enact/agate/SwitchItem';
import SliderButton from '@enact/agate/SliderButton';

import viewCss from './Settings.less';
import AppContextConnect from '../App/AppContextConnect';

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

	render: ({css, onSelect, onSwitchUser, userId, onToggleDateTimePopup, ...rest}) => (
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
						<Cell shrink>
							<SliderButton
								onChange={onSwitchUser}
								value={userId - 1}
							>
								{['User 1','User 2']}
							</SliderButton>
						</Cell>
						<SwitchItemCell
							icon="user"
							noToggle
							data-tabindex={5}
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
					</Column>
				</Cell>
			</Row>
		</Panel>
	)
});

const ConnectedSettings = AppContextConnect(({userId, updateAppState}) => ({
	userId: userId,
	onSwitchUser: ({value}) => {
		updateAppState((draft) => {
				draft.userId = value + 1
			}
		)
	}
}))(Settings)

export default ConnectedSettings;
