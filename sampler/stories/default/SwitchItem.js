import SwitchItem, {SwitchItemBase} from '@enact/agate/SwitchItem';
import Switch, {SwitchBase} from '@enact/agate/Switch';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';
import iconNames from './icons';

SwitchItem.displayName = 'SwitchItem';
// const Config = mergeComponentMetadata('SwitchItem', SwitchItemBase, SwitchItem);

// Set up some defaults for info and knobs
const prop = {

};

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
