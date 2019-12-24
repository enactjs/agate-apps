import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';

import AppContextConnect from '../App/AppContextConnect';
import AppIconCell from '../components/AppIconCell';
import {getPanelIndexOf} from '../App';

import css from './AppList.module.less';

import productivity_icon from '../../assets/apps/productivity_icon.png';
import gaming_icon from '../../assets/apps/gaming_icon.png';

const AppListBase = kind({
	name: 'Home',

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		},
		onTabLaunch: (ev, {sendLaunchLuna}) => {
			const
				{keyCode, type, currentTarget: {dataset: {appid: id}}} = ev,
				params = {displayAffinity: 0};

			if ((keyCode === 13 || type === 'click') && id) {
				console.log(id, params);
				sendLaunchLuna({id, params});
			}
		}
	},

	propTypes: {
		onPopupOpen: PropTypes.func,
		onSelect: PropTypes.func,
		onToggleBasicPopup: PropTypes.func,
		onTogglePopup: PropTypes.func
	},

	styles: {
		css,
		className: 'appList'
	},

	render: ({onTabChange, onTabLaunch, onTogglePopup, onToggleBasicPopup, onPopupOpen, ...rest}) => {
		delete rest.sendLaunchLuna;
		return (
			<Panel {...rest}>
				<Column align="center center">
					<Cell shrink>
						<Row className={css.row} align="start center">
							<AppIconCell icon="climate" data-tabindex={getPanelIndexOf('hvac')} onKeyUp={onTabChange} onClick={onTabChange}>Climate</AppIconCell>
							<AppIconCell icon="compass" data-tabindex={getPanelIndexOf('map')} onKeyUp={onTabChange} onClick={onTabChange}>Navigation</AppIconCell>
							<AppIconCell icon="phone" data-tabindex={getPanelIndexOf('phone')} onKeyUp={onTabChange} onClick={onTabChange}>Phone</AppIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row className={css.row} align="start center">
							<AppIconCell icon="radio" data-tabindex={getPanelIndexOf('radio')} onKeyUp={onTabChange} onClick={onTabChange}>Radio</AppIconCell>
							<AppIconCell icon="rearscreen" data-tabindex={getPanelIndexOf('multimedia')} onKeyUp={onTabChange} onClick={onTabChange}>Multimedia</AppIconCell>
							<AppIconCell icon="pairing" onKeyUp={onPopupOpen} onClick={onToggleBasicPopup}>Connect</AppIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row className={css.row} align="start center">
							<AppIconCell icon="dashboard" data-tabindex={getPanelIndexOf('dashboard')} onKeyUp={onTabChange} onClick={onTabChange}>Dashboard</AppIconCell>
							<AppIconCell icon="setting" data-tabindex={getPanelIndexOf('settings')} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
							<AppIconCell icon="closex" onClick={onTogglePopup}>Point of Interest</AppIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row className={css.row} align="start center">
							<AppIconCell icon="weather" data-tabindex={getPanelIndexOf('weather')} onKeyUp={onTabChange} onClick={onTabChange}>Weather</AppIconCell>
							<AppIconCell icon={productivity_icon} data-appid={'com.ms.app.test.calendar'} onKeyUp={onTabLaunch} onClick={onTabLaunch}>Productivity</AppIconCell>
							<AppIconCell icon={gaming_icon} data-appid={'com.webos.app.scrcpy'} onKeyUp={onTabLaunch} onClick={onTabLaunch}>Gaming</AppIconCell>
						</Row>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

const AppList = AppContextConnect(({sendLaunchLuna}) => ({
	sendLaunchLuna
}))(AppListBase);

export default AppList;
