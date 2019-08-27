import Button, {ButtonBase} from '@enact/agate/Button';
import UiButton from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import icons from './icons';
import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Button.displayName = 'Button';
const Config = mergeComponentMetadata('Button', UiButton, ButtonBase, Button);

// Set up some defaults for info and knobs
const prop = {
	casing: ['preserve', 'sentence', 'word', 'upper'],
	icons: ['', ...icons],
	joinedPosition: ['', 'left', 'center', 'right']
};

storiesOf('Agate', module)
	.add(
		'Button',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', ['', 'transparent'], Config, '')}
				disabled={boolean('disabled', Config)}
				highlighted={boolean('highlighted', Config)}
				icon={select('icon', prop.icons, Config)}
				joinedPosition={select('joinedPosition', prop.joinedPosition, Config)}
				selected={boolean('selected', Config)}
				small={boolean('small', Config)}
				type={select('type', ['standard', 'grid'], Config)}
			>
				{text('children', Button, 'Click me')}
			</Button>
		),
		{
			text: 'The basic Button'
		}
	);
