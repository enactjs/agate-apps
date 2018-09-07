import {Cell, Column, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import Item from '@enact/agate/Item';
import Icon from '@enact/agate/Icon';
// import IconItem from '@enact/agate/IconItem';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import SwitchItem from '@enact/agate/SwitchItem';

import viewCss from './Settings.less';

const IconItemCell = kind({
	name: 'IconItemCell',
	styles: {
		css: viewCss,
		className: 'item'
	},
	//TODO: IconItem (or Icon I think) is difficult to match the icon style for SwitchItem; this is as close as I can get with bare components
	render: ({children, icon, ...rest}) => {
		return (
			<Cell component={Item} {...rest}>
				<Icon>
					{icon}
				</Icon>
				{children}
			</Cell>
		);
	}
});

const SwitchItemCell =  kind({
	name: 'SwitchItemCell',
	render: (props) => {
		return (
			<Cell component={SwitchItem} {...props} />
		);
	}
});

const Settings = kind({
	name: 'Settings',
	styles: {
		css: viewCss,
		className: 'settingsView'
	},

	render: ({css, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit">
				<Cell />
				<Cell
					align="center"
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
					<IconItemCell
						icon="star"
						shrink
					>
						Date & Time
					</IconItemCell>
					<SwitchItemCell
						icon="bulletlist"
						shrink
					>
						Bluetooth
					</SwitchItemCell>
					<SwitchItemCell
						icon="gear"
						shrink
					>
						WiFi
					</SwitchItemCell>
					<SwitchItemCell
						icon="arrowlargeup"
						offText="disarmed"
						onText="armed"
						shrink
					>
						Ejection Seat
					</SwitchItemCell>
					<Cell />
				</Cell>
				<Cell />
			</Row>
		</Panel>
	)
});

export default Settings;
