import Divider, {DividerBase} from '@enact/agate/Divider';

import React from 'react';
import {storiesOf} from '@storybook/react';

import icons from './icons';
import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Divider.displayName = 'Divider';
const Config = mergeComponentMetadata('Divider', Divider, DividerBase);

const prop = {
	icons: ['', ...icons],
	spacing: ['', 'normal', 'small', 'medium', 'large', 'none']
};

storiesOf('Agate', module)
	.add(
		'Divider',
		() => (
			<Divider
				icon={select('icon', prop.icons, Config)}
				startSection={boolean('startSection', Config)}
				spacing={select('spacing', prop.spacing, Config)}
			>
				{text('children', Divider, 'Divider Text')}
			</Divider>
		),
		{
			text: 'The basic Divider'
		}
	);
