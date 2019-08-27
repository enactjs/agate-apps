import SliderItem from '@enact/agate/SliderItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

import iconNames from './icons';
import {boolean, number, select} from '../../src/enact-knobs';

SliderItem.displayName = 'SliderItem';

storiesOf('Agate', module)
	.add(
		'SliderItem',
		() => (
			<SliderItem
				decrementIcon={select('decrementIcon', [...iconNames], SliderItem, 'minus')}
				disabled={boolean('disabled', SliderItem)}
				incrementIcon={select('incrementIcon', [...iconNames], SliderItem, 'plus')}
				knobStep={number('knobStep', SliderItem)}
				max={number('max', SliderItem)}
				min={number('min', SliderItem)}
				noFill={boolean('noFill', SliderItem)}
				step={number('step', SliderItem)} // def: 1
			/>
		),
		{
			text: 'Basic usage of SliderItem'
		}
	);
