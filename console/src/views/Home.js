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

	render: ({onTogglePopup, ...rest}) => {
		return(
			<Panel {...rest}>
				<Column align="center center">
					<Cell shrink>
						<Row align="start center">
							<HomeIconCell icon="rollforward">HVAC</HomeIconCell>
							<HomeIconCell icon="exitfullscreen">Navigation</HomeIconCell>
							<HomeIconCell icon="info">Phone</HomeIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row align="start center">
							<HomeIconCell icon="audio">Radio</HomeIconCell>
							<HomeIconCell icon="resumeplay">Multimedia</HomeIconCell>
							<HomeIconCell icon="repeat">Connect</HomeIconCell>
						</Row>
					</Cell>
					<Cell shrink>
						<Row align="start center">
							<HomeIconCell icon="repeatdownload">Dashboard</HomeIconCell>
							<HomeIconCell icon="gear">Settings</HomeIconCell>
							<HomeIconCell icon="closex" onClick={onTogglePopup}>Point of Interest</HomeIconCell>
						</Row>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

export default Home;
