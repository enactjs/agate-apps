import CheckboxItem from '@enact/agate/CheckboxItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

CheckboxItem.displayName = 'CheckboxItem';
const Config = mergeComponentMetadata('CheckboxItem', CheckboxItem);

storiesOf('Agate', module)
	.add(
		'CheckboxItem',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', Config)}
				iconPosition={select('iconPosition', ['', 'after', 'before'], Config, '')}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, 'Hello CheckboxItem')}
			</CheckboxItem>
		),
		{
			info: {
				text: 'Basic usage of CheckboxItem'
			}
		}
	);
