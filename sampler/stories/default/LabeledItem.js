import LabeledItem from '@enact/agate/LabeledItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import iconNames from './icons';
import {boolean, text, select} from '../../src/enact-knobs';
LabeledItem.displayName = 'LabeledItem';

storiesOf('Agate', module)
	.add(
		'LabeledItem',
		withInfo({
			text: 'Basic usage of LabeledItem'
		})(() => (
			<LabeledItem
				label={text('label', LabeledItem, 'Label')}
				disabled={boolean('disabled', LabeledItem)}
				titleIcon={select('titleIcon', ['', ...iconNames], LabeledItem, 'fullscreen')}
			>
				{text('children', LabeledItem, 'Hello LabeledItem')}
			</LabeledItem>
		))
	);
