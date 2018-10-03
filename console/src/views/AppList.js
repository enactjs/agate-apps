import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import AppIconCell from '../components/AppIconCell';

const AppList = kind({
	name: 'Home',

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({onTabChange, onTogglePopup, onToggleBasicPopup, onPopupOpen, ...rest}) => {
		return(
			<Panel {...rest}>
				<Column align="center center">
					<Cell shrink>
						<Row align="start center">
							<AppIconCell size={180} icon="temperature" data-tabindex={2} onKeyUp={onTabChange} onClick={onTabChange}>Climate</AppIconCell>
							<AppIconCell size={180} icon="compass">Navigation</AppIconCell>
							<AppIconCell size={180} icon="phone" data-tabindex={1} onKeyUp={onTabChange} onClick={onTabChange}>Phone</AppIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row align="start center">
							<AppIconCell size={180} icon="audio" data-tabindex={3} onKeyUp={onTabChange} onClick={onTabChange}>Radio</AppIconCell>
							<AppIconCell size={180} icon="resumeplay">Multimedia</AppIconCell>
							<AppIconCell size={180} icon="repeat" onKeyUp={onPopupOpen} onClick={onToggleBasicPopup}>Connect</AppIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row align="start center">
							<AppIconCell size={180} icon="repeatdownload">Dashboard</AppIconCell>
							<AppIconCell size={180} icon="gear" data-tabindex={4} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
							<AppIconCell size={180} icon="closex" onClick={onTogglePopup}>Point of Interest</AppIconCell>
						</Row>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

export default AppList;
