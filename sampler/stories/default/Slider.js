import Slider, {SliderBase} from '@enact/agate/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Slider.displayName = 'Slider';
const Config = mergeComponentMetadata('Slider', SliderBase, Slider);

storiesOf('Agate', module)
	.add(
		'Slider',
		withInfo({
			text: 'The basic Slider'
		})(() => (
			<Slider
				activateOnFocus={boolean('activateOnFocus', Config)}
				active={boolean('active', Config)}
				disabled={boolean('disabled', Config)}
				focused={boolean('focused', Config)}
				max={number('max', Config)}
				min={number('min', Config)}
				onActivate={action('onActivate')}
				onKeyDown={action('onKeyDown')}
				onKeyUp={action('onKeyUp')}
				orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
				step={number('step', Config)}
			/>
		))
	);
