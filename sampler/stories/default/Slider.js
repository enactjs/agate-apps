import Slider, {SliderBase} from '@enact/agate/Slider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean} from '../../src/enact-knobs';
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
				onChange={action('onChange')}
				disabled={boolean('disabled', Config)}
			/>
		))
	);
