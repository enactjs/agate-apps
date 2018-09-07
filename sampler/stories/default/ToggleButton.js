import ToggleButton, {ToggleButtonBase} from '@enact/agate/ToggleButton';
import UiButton from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import icons from './icons';
import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

ToggleButton.displayName = 'Button';
const Config = mergeComponentMetadata('Button', UiButton, ToggleButtonBase, ToggleButton);

// Set up some defaults for info and knobs
const prop = {
	casing: ['preserve', 'sentence', 'word', 'upper'],
	icons: ['', ...icons]
};

storiesOf('Agate', module)
	.add(
		'ToggleButton',
		withInfo({
			text: 'The basic ToggleButton'
		})(() => (
			<ToggleButton
				onClick={action('onClick')}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				small={boolean('small', Config)}
				onToggle={action('onToggle')}
				toggleIndicator={boolean('toggleIndicator', Config, true)}
				toggleOffLabel={text('toggleOffLabel', Config, 'Off')}
				toggleOnLabel={text('toggleOnLabel', Config, 'On')}
				type={select('type', ['standard', 'grid'], Config, 'grid')}
			>
				{text('children', ToggleButton, 'Click me')}
			</ToggleButton>
		))
	);
