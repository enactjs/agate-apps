import Icon from '@enact/agate/Icon';
import LabeledSlider, {LabeledSliderBase} from '@enact/agate/LabeledSlider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {decrementIcons, incrementIcons} from './icons';
import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

LabeledSlider.displayName = 'LabeledSlider';
const Config = mergeComponentMetadata('LabeledSlider', LabeledSliderBase, LabeledSlider);

storiesOf('Agate', module)
	.add(
		'LabeledSlider',
		() => (
			<div>
				<LabeledSlider
					active={boolean('active', Config)}
					decrementIcon="minus"
					disabled={boolean('disabled', Config)}
					focused={boolean('focused', Config)}
					knobStep={number('knobStep', Config)}
					incrementIcon="plus"
					max={number('max', Config)}
					min={number('min', Config)}
					onActivate={action('onActivate')}
					onChange={action('onChange')}
					onDragEnd={action('onDragEnd')}
					onDragStart={action('onDragStart')}
					orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
					step={number('step', Config)}
				/>

				<LabeledSlider
					active={boolean('active', Config)}
					decrementText="A"
					disabled={boolean('disabled', Config)}
					focused={boolean('focused', Config)}
					knobStep={number('knobStep', Config)}
					incrementText="A"
					max={number('max', Config)}
					min={number('min', Config)}
					onActivate={action('onActivate')}
					onChange={action('onChange')}
					onDragEnd={action('onDragEnd')}
					onDragStart={action('onDragStart')}
					orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
					step={number('step', Config)}
				/>

				<LabeledSlider>
					active={boolean('active', Config)}
					disabled={boolean('disabled', Config)}
					focused={boolean('focused', Config)}
					knobStep={number('knobStep', Config)}
					max={number('max', Config)}
					min={number('min', Config)}
					onActivate={action('onActivate')}
					onChange={action('onChange')}
					onDragEnd={action('onDragEnd')}
					onDragStart={action('onDragStart')}
					orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
					step={number('step', Config)}
				>
					<div slot="decrementText" style={{fontSize: '30px'}}>A</div>
					<div slot="incrementText">A</div>
				</LabeledSlider>
			</div>
		),
		{
			text: 'The basic LabeledSlider'
		}
	);
