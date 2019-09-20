import Divider from '@enact/agate/Divider';
import Icon from '@enact/agate/Icon';
import IconItem from '@enact/agate/IconItem';
import Item from '@enact/agate/Item';
import LabeledItem from '@enact/agate/LabeledItem';
import Scroller from '@enact/agate/Scroller';
import SlotItem from '@enact/agate/SlotItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

Item.displayName = 'Item';

storiesOf('Agate', module)
	.add(
		'Item Kitchen Sink',
		() => (
			<Scroller>
				<IconItem icon="home" titleIcon="home">IconItem</IconItem>
				<LabeledItem label="label" titleIcon="home">LabeledItem</LabeledItem>
				<SlotItem slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>SlotItem</SlotItem>
				<Divider startSection>Item variations</Divider>
				<Item>Default Item</Item>
				<Item label="label above" labelPosition="above">Item</Item>
				<Item label="label below" labelPosition="below">Item</Item>
				<Item label="label before" labelPosition="before">Item</Item>
				<Item label="label after" labelPosition="after">Item</Item>
				<Divider startSection>Item with labels and slot before</Divider>
				<Item label="label above" labelPosition="above" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item label="label below" labelPosition="below" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item label="label before" labelPosition="before" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item label="label after" labelPosition="after" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Divider startSection>Item with labels and slot after</Divider>
				<Item label="label above" labelPosition="above" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Item label="label below" labelPosition="below" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Item label="label before" labelPosition="before" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Item label="label after" labelPosition="after" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Divider startSection>Item with labels, slot after, and slot before</Divider>
				<Item label="label above" labelPosition="above" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item label="label below" labelPosition="below" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item label="label before" labelPosition="before" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item label="label after" labelPosition="after" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
				<Divider startSection>All Items inlined</Divider>
				<Item inline>Default Item</Item>
				<Item inline label="label above" labelPosition="above">Item</Item>
				<Item inline label="label below" labelPosition="below">Item</Item>
				<Item inline label="label before" labelPosition="before">Item</Item>
				<Item inline label="label after" labelPosition="after">Item</Item>
				<Divider startSection>Item with labels and slot before</Divider>
				<Item inline label="label above" labelPosition="above" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label below" labelPosition="below" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label before" labelPosition="before" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label after" labelPosition="after" slotBefore={<Icon>home</Icon>}>Item</Item>
				<Divider startSection>Item with labels and slot after</Divider>
				<Item inline label="label above" labelPosition="above" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label below" labelPosition="below" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label before" labelPosition="before" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label after" labelPosition="after" slotAfter={<Icon>home</Icon>}>Item</Item>
				<Divider startSection>Item with labels, slot after, and slot before</Divider>
				<Item inline label="label above" labelPosition="above" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label below" labelPosition="below" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label before" labelPosition="before" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
				<Item inline label="label after" labelPosition="after" slotAfter={<Icon>home</Icon>} slotBefore={<Icon>home</Icon>}>Item</Item>
			</Scroller>
		),
		{
			text: 'Item Kitchen Sink'
		}
	);
