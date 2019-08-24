import RadioItem from '@enact/agate/RadioItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import iconNames from './icons';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('RadioItem', RadioItem);
RadioItem.displayName = 'RadioItem';

storiesOf('Agate', module)
	.add(
		'RadioItem',
		() => (
			<div>
				<RadioItem
					defaultSelected={boolean('defaultSelected', Config)}
					iconPosition={select('iconPosition', ['before', 'after'], Config, 'after')}
				>
					{text('children', Config, 'Sound')}
				</RadioItem>
			</div>
		),
		{
			text: 'The basic RadioItem'
		}
	);
