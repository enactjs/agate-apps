import Icon, {icons as iconList} from '@enact/agate/Icon';
import Item, {ItemBase} from '@enact/agate/Item';
import UiItem, {ItemBase as UiItemBase} from '@enact/ui/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Item', UiItemBase, UiItem, ItemBase, Item);
Item.displayName = 'Item';

const icons = Object.keys(iconList);

storiesOf('Agate', module)
	.add(
		'Item',
		() => (
			<Item
				disabled={boolean('disabled', Config)}
				inline={boolean('inline', Config)}
				label={text('label', Config, '')}
				labelPosition={select('labelPosition', ['above', 'after', 'before', 'below'], Config, 'below')}
				selected={boolean('selected', Config)}
			>
				<Icon slot="slotBefore">
					{select('slotBefore', [null, ...icons], Config, null)}
				</Icon>
				{text('children', Config, 'Hello Item')}
				<Icon slot="slotAfter">
					{select('slotAfter', [null, ...icons], Config, null)}
				</Icon>
			</Item>
		),
		{
			text: 'Basic usage of Item'
		}
	);
