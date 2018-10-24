import LabeledIcon from '@enact/agate/LabeledIcon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import iconNames from './icons';
import {boolean, text, select} from '../../src/enact-knobs';
LabeledIcon.displayName = 'LabeledIcon';

storiesOf('Agate', module)
	.add(
		'LabeledIcon',
		withInfo({
			text: 'Basic usage of LabeledIcon'
		})(() => (
			<LabeledIcon
				icon={select('icon', ['', ...iconNames], LabeledIcon, 'temperature')}
				disabled={boolean('disabled', LabeledIcon)}
			>
				{text('children', LabeledIcon, 'Hello LabeledIcon')}
			</LabeledIcon>
		))
	);
