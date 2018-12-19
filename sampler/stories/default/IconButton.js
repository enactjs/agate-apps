import IconButton, {IconButtonBase} from '@enact/agate/IconButton';
import UiButton from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import icons from './icons';
import {boolean, select, text} from '../../src/enact-knobs';
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
		withInfo({
			text: 'The basic IconButton'
		})(() => (
			<IconButton
				onClick={action('onClick')}
				disabled={boolean('disabled', Config)}
				highlighted={boolean('highlighted', Config)}
				selected={boolean('selected', Config)}
				small={boolean('small', Config)}
				type={select('type', ['standard', 'grid'], Config)}
			>
				{select('children', prop.icons, Config, 'home')}
			</IconButton>
		))
	);
