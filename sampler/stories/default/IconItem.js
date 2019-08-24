import IconItem from '@enact/agate/IconItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

import iconNames from './icons';
import {boolean, text, select} from '../../src/enact-knobs';
IconItem.displayName = 'IconItem';

storiesOf('Agate', module)
	.add(
		'IconItem',
		() => (
			<IconItem
				label={text('label', IconItem, 'Label')}
				disabled={boolean('disabled', IconItem)}
				iconBefore={select('iconBefore', ['', ...iconNames], IconItem, 'home')}
				iconAfter={select('iconAfter', ['', ...iconNames], IconItem, 'arrowlargeright')}
			>
				{text('children', IconItem, 'Hello IconItem')}
			</IconItem>
		),
		{
			text: 'Basic usage of IconItem'
		}
	);
