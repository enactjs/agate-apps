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
		() => {
			const slotBeforeIcon = select('slotBefore Icon', [null, ...icons], Config);
			const slotAfterIcon = select('slotAfter Icon', [null, ...icons], Config);
			return (
				<Item
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					label={text('label', Config)}
					labelPosition={select('labelPosition', ['above', 'after', 'before', 'below'], Config, 'below')}
					selected={boolean('selected', Config)}
				>
					{slotBeforeIcon ? <slotBefore>
						<Icon>{slotBeforeIcon}</Icon>
					</slotBefore> : null}
					{text('children', Config, 'Hello Item')}
					{slotAfterIcon ? <slotAfter>
						<Icon>{slotAfterIcon}</Icon>
					</slotAfter> : null}
				</Item>
			);
		},
		{
			text: 'Basic usage of Item'
		}
	);
