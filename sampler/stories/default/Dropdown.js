import Dropdown, {DropdownBase} from '@enact/agate/Dropdown';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, text, select} from '../../src/enact-knobs';
import Item from '@enact/agate/Item';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Dropdown', Dropdown, DropdownBase);
Dropdown.displayName = 'Dropdown';

const prop = {
	colors: ['green', 'yellow', 'orange', 'red', 'black', 'gray', 'white', 'maroon', 'brown']
};

storiesOf('Agate', module)
	.add(
		'Dropdown',
		() => (
			<div>
				<Dropdown
					disabled={boolean('disabled', Config)}
					onChange={action('onChange')}
				>
					{prop.colors}
				</Dropdown>
				<Item>Default Item</Item>
			</div>
		),
		{
			text: 'The basic Dropdown'
		}
	);