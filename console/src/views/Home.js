import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import LabeledIconButton from '@enact/agate/LabeledIconButton';

import css from './Home.less';

const HomeIconCell = kind({
	name: 'HomeIconCell',
	styles: {
		css,
		className: 'iconCell'
	},

	render: ({children, ...rest}) => (
		<Cell component={LabeledIconButton} size={180} {...rest}>{children}</Cell>
	)
});

const Home = kind({
	name: 'Home',

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if (ev.currentTarget.dataset.tabindex) {
				onSelect({selected: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({onTabChange, onTogglePopup, onToggleBasicPopup, onPopupOpen, ...rest}) => {
		return(
			<Panel {...rest}>
				<Column align="center center">
					<Cell shrink>
						<Row align="start center">
							<HomeIconCell icon="temperature" data-tabindex={2} onClick={onTabChange}>Climate</HomeIconCell>
							<HomeIconCell icon="compass">Navigation</HomeIconCell>
							<HomeIconCell icon="phone" data-tabindex={1} onClick={onTabChange}>Phone</HomeIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row align="start center">
							<HomeIconCell icon="audio">Radio</HomeIconCell>
							<HomeIconCell icon="resumeplay">Multimedia</HomeIconCell>
							<HomeIconCell icon="repeat" onClick={onToggleBasicPopup}>Connect</HomeIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row align="start center">
							<HomeIconCell icon="repeatdownload">Dashboard</HomeIconCell>
							<HomeIconCell icon="gear" data-tabindex={3} onClick={onTabChange}>Settings</HomeIconCell>
							<HomeIconCell icon="closex" onClick={onTogglePopup}>Point of Interest</HomeIconCell>
						</Row>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

export default Home;