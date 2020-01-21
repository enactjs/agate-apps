import Slider, {SliderBase} from '@enact/agate/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@enact/storybook-utils/addons/actions';

import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';

Slider.displayName = 'Slider';
const Config = mergeComponentMetadata('Slider', SliderBase, Slider);

storiesOf('Agate', module)
	.add(
		'Slider',
		() => (
			<Slider
				activateOnFocus={boolean('activateOnFocus', Config)}
				active={boolean('active', Config)}
				disabled={boolean('disabled', Config)}
				focused={boolean('focused', Config)}
				knobStep={number('knobStep', Config)}
				max={number('max', Config)}
				min={number('min', Config)}
				onActivate={action('onActivate')}
				onKeyDown={action('onKeyDown')}
				onKeyUp={action('onKeyUp')}
				orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
				step={number('step', Config)}
			/>
		),
		{
			text: 'The basic Slider'
		}
	);
