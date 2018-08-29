import Button from '@enact/agate/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Button.displayName = 'Button';
const Config = mergeComponentMetadata('Button', Button);

// Set up some defaults for info and knobs
const prop = {
	casing: ['preserve', 'sentence', 'word', 'upper'],
	icons: ['', ...Object.keys(icons)]
};

storiesOf('Agate', module)
	.add(
		'Button',
		withInfo({
			text: 'The basic Button'
		})(() => (
			<Button
				onClick={action('onClick')}
				casing={select('casing', prop.casing, Config, 'upper')}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				minWidth={!!boolean('minWidth', Config)}
				selected={boolean('selected', Config)}
				small={boolean('small', Config)}
			>
				{text('children', Button, 'Click me')}
			</Button>
		))
	);
