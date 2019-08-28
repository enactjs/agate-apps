import {Cell, Column, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import LabeledItem from '@enact/agate/LabeledItem';
import SwitchItem from '@enact/agate/SwitchItem';
import PropTypes from 'prop-types';

import AppContextConnect from '../App/AppContextConnect';
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

const SettingsView = kind({
	name: 'Settings',

	propTypes: {
		sendTelemetry: PropTypes.func
	},

	styles: {
		css: viewCss,
		className: 'settingsView'
	},

	handlers: {
		onSelect: (ev, {onSelect}) => {
			onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
		},
		onSelectDateTimeSetting: (ev, {sendTelemetry}) => {
			const time = new Date();
			time.setSeconds(time.getSeconds() - 1);
			sendTelemetry({
				appInstanceId: 'settings',
				appName: 'settings',
				featureName: 'Date & Time change',
				status: 'Running',
				appStartTime: time,
				intervalFlag: false
			});
		},
		onSelectOtherSettings: (ev, {sendTelemetry}) => {
			const time = new Date();
			time.setSeconds(time.getSeconds() - 1);
			sendTelemetry({
				appInstanceId: 'settings',
				appName: 'settings',
				featureName: 'Settings change',
				status: 'Running',
				appStartTime: time,
				intervalFlag: false
			});
		}
	},

	render: ({css, ipAddress, onSelect, onToggleDateTimePopup, onReloadApp, onSelectDateTimeSetting, onSelectOtherSettings, ...rest}) => {
		delete rest.sendTelemetry;

		return (
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
							<div onClick={onSelectDateTimeSetting}>
								<SwitchItemCell
									icon="datetime"
									noToggle
									onClick={onToggleDateTimePopup}
								>
									Date & Time
								</SwitchItemCell>
							</div>
							<SwitchItemCell
								icon="bluetooth"
								onClick={onSelectOtherSettings}
							>
								Bluetooth
							</SwitchItemCell>
							<SwitchItemCell
								icon="wifi"
								onClick={onSelectOtherSettings}
							>
								WiFi
							</SwitchItemCell>
							<SwitchItemCell
								icon="fan"
								onClick={onSelectOtherSettings}
							>
								Turbo
							</SwitchItemCell>
							<SwitchItemCell
								icon="heatseatright"
								offText="disarmed"
								onText="armed"
								onClick={onSelectOtherSettings}
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
		);
	}
});

const ConnectSettings = AppContextConnect(({sendTelemetry}) => ({
	sendTelemetry
}));

export default ConnectSettings(NetworkInfo(SettingsView));
