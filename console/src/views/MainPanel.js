import Button from '@enact/agate/Button';
import SliderButton from '@enact/agate/SliderButton';
import LabeledItem from '@enact/agate/LabeledItem';
import Item from '@enact/agate/Item';
import SwitchItem from '@enact/agate/SwitchItem';
import Divider from '@enact/agate/Divider';
import {Cell, Column} from '@enact/ui/Layout';
import Icon from '@enact/agate/Icon';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Column>
				<Cell shrink>
					<Icon>fullscreen</Icon>
					<Button icon="fullscreen" />
					<Button icon="fullscreen" type="grid" />
					<Button icon="fullscreen" type="grid">Click me</Button>
					<Button icon="fullscreen">Click me</Button>
					<Button>Click me</Button>
					<Button type="grid">Click me</Button>
				</Cell>
				<Cell>
					<SliderButton>
						{['Normal', 'Wicked', 'Rad', 'Bananas']}
					</SliderButton>
					<Divider>Divider</Divider>
					<LabeledItem>LabeledItem</LabeledItem>
					<Item>Item</Item>
					<SwitchItem>SwitchItem</SwitchItem>
				</Cell>
			</Column>
		</Panel>
	)
});

export default MainPanel;
