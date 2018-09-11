import SwitchItem from '@enact/agate/SwitchItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {select, text} from '../../src/enact-knobs';
import iconNames from './icons';

SwitchItem.displayName = 'SwitchItem';


storiesOf('Agate', module)
	.add(
		'SwitchItem',
		withInfo({
			text: 'The basic SwitchItem'
		})(() => (
			<div>
				<SwitchItem
					icon={select('icon', ['', ...iconNames], {}, 'music')}
				>
					{text('children', 'Sound')}
				</SwitchItem>
			</div>
		))
	);
