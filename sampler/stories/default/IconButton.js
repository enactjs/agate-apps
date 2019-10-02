import IconButton, {IconButtonBase} from '@enact/agate/IconButton';
import UiButton from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import icons from './icons';
import {boolean, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

IconButton.displayName = 'IconButton';
const Config = mergeComponentMetadata('IconButton', UiButton, IconButtonBase, IconButton);

// Set up some defaults for info and knobs
const prop = {
	casing: ['preserve', 'sentence', 'word', 'upper'],
	icons: ['', ...icons],
	joinedPosition: ['', 'left', 'center', 'right']
};

storiesOf('Agate', module)
	.add(
		'IconButton',
		() => (
			<IconButton
				onClick={action('onClick')}
				disabled={boolean('disabled', Config)}
				highlighted={boolean('highlighted', Config)}
				selected={boolean('selected', Config)}
				size={select('size', ['smallest', 'small', 'large', 'huge'], Config)}
				type={select('type', ['standard', 'grid'], Config)}
			>
				{select('children', prop.icons, Config, 'home')}
			</IconButton>
		),
		{
			text: 'The basic IconButton'
		}
	);
