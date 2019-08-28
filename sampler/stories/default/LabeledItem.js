import LabeledItem from '@enact/agate/LabeledItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

import iconNames from './icons';
import {boolean, text, select} from '../../src/enact-knobs';
LabeledItem.displayName = 'LabeledItem';

storiesOf('Agate', module)
	.add(
		'LabeledItem',
		() => (
			<LabeledItem
				disabled={boolean('disabled', LabeledItem)}
				icon={select('icon', ['', ...iconNames], LabeledItem, 'expand')}
				label={text('label', LabeledItem, 'Label')}
				labelInline={boolean('labelInline', LabeledItem)}
				labelPosition={select('labelPosition', ['before', 'after', 'above', 'below', 'right'], LabeledItem, 'after')}
			>
				{text('children', LabeledItem, 'Hello LabeledItem')}
			</LabeledItem>
		),
		{
			text: 'Basic usage of LabeledItem'
		}
	);
