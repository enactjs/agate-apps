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
				label={text('label', LabeledItem, 'Label')}
				labelPosition={select('labelPosition', ['above', 'after', 'before', 'below'], LabeledItem, 'after')}
				titleIcon={select('titleIcon', ['', ...iconNames], LabeledItem, 'arrowlargeright')}
			>
				{text('children', LabeledItem, 'Hello LabeledItem')}
			</LabeledItem>
		),
		{
			text: 'Basic usage of LabeledItem'
		}
	);
