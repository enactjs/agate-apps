import ProgressBar from '@enact/agate/ProgressBar';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

ProgressBar.displayName = 'ProgressBar';
const Config = mergeComponentMetadata('ProgressBar', ProgressBar);

storiesOf('Agate', module)
	.add(
		'ProgressBar',
		withInfo({
			text: 'The basic ProgressBar'
		})(() => (
			<ProgressBar
				disabled={boolean('disabled', Config)}
				focused={boolean('focused', Config)}
				small={boolean('small', Config)}
				orientation={select('orientation', ['horizontal', 'vertical'], Config, 'horizontal')}
				progress={number('progress', 0.5)}
			/>
		))
	);
