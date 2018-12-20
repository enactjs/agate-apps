import RadioItem from '@enact/agate/RadioItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import iconNames from './icons';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('RadioItem', RadioItem);
RadioItem.displayName = 'RadioItem';

storiesOf('Agate', module)
	.add(
		'RadioItem',
		withInfo({
			text: 'The basic RadioItem'
		})(() => (
			<div>
				<RadioItem
					defaultSelected={boolean('defaultSelected', Config)}
					icon={select('icon', ['', ...iconNames], Config, 'music')}
				>
					{text('children', 'Sound')}
				</RadioItem>
			</div>
		))
	);
