import IncrementSlider, {IncrementSliderBase} from '@enact/agate/IncrementSlider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {decrementIcons, incrementIcons} from './icons';
import {boolean, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

IncrementSlider.displayName = 'IncrementSlider';
const Config = mergeComponentMetadata('IncrementSlider', IncrementSliderBase, IncrementSlider);

storiesOf('Agate', module)
	.add(
		'IncrementSlider',
		withInfo({
			text: 'The basic IncrementSlider'
		})(() => (
			<IncrementSlider
				onChange={action('onChange')}
				disabled={boolean('disabled', Config)}
				decrementIcon={select('decrementIcon', decrementIcons, Config)}
				incrementIcon={select('incrementIcon', incrementIcons, Config)}
			/>
		))
	);
