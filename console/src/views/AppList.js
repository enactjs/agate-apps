import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';

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

	propTypes: {
		onPopupOpen: PropTypes.func,
		onSelect: PropTypes.func,
		onToggleBasicPopup: PropTypes.func,
		onTogglePopup: PropTypes.func
	},

	render: ({onTabChange, onTogglePopup, onToggleBasicPopup, onPopupOpen, ...rest}) => (
		<Panel {...rest}>
			<Column align="center center">
				<Cell shrink>
					<Row align="start center">
						<AppIconCell icon="temperature" data-tabindex={2} onKeyUp={onTabChange} onClick={onTabChange}>Climate</AppIconCell>
						<AppIconCell icon="compass">Navigation</AppIconCell>
						<AppIconCell icon="phone" data-tabindex={1} onKeyUp={onTabChange} onClick={onTabChange}>Phone</AppIconCell>
					</Row>
				</Cell>
				<Cell shrink>
					<Row align="start center">
						<AppIconCell icon="audio" data-tabindex={3} onKeyUp={onTabChange} onClick={onTabChange}>Radio</AppIconCell>
						<AppIconCell icon="resumeplay">Multimedia</AppIconCell>
						<AppIconCell icon="repeat" onKeyUp={onPopupOpen} onClick={onToggleBasicPopup}>Connect</AppIconCell>
					</Row>
				</Cell>
				<Cell shrink>
					<Row align="start center">
						<AppIconCell icon="repeatdownload">Dashboard</AppIconCell>
						<AppIconCell icon="gear" data-tabindex={5} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
						<AppIconCell icon="closex" onClick={onTogglePopup}>Point of Interest</AppIconCell>
					</Row>
				</Cell>
				<Cell shrink>
					<Row align="start center">
						<AppIconCell icon="gear" data-tabindex={7} onKeyUp={onTabChange} onClick={onTabChange}>Weather</AppIconCell>
					</Row>
				</Cell>
			</Column>
		</Panel>
	)
});

export default AppList;
