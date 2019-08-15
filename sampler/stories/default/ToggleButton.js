import ToggleButton, {ToggleButtonBase} from '@enact/agate/ToggleButton';
import UiButton from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import icons from './icons';
import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

ToggleButton.displayName = 'ToggleButton';
const Config = mergeComponentMetadata('ToggleButton', UiButton, ToggleButtonBase, ToggleButton);

// Set up some defaults for info and knobs
const prop = {
	icons: ['', ...icons]
};

storiesOf('Agate', module)
	.add(
		'ToggleButton',
		() => (
			<ToggleButton
				onClick={action('onClick')}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				small={boolean('small', Config)}
				onToggle={action('onToggle')}
				underline={boolean('underline', Config, true)}
				toggleOffLabel={text('toggleOffLabel', Config, 'Off')}
				toggleOnLabel={text('toggleOnLabel', Config, 'On')}
				type={select('type', ['grid', 'standard'], Config, 'standard')}
			>
				{text('children', ToggleButton, 'Click me')}
			</ToggleButton>
		),
		{
			text: 'The basic ToggleButton'
		}
	);
