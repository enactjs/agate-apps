import Divider, {DividerBase} from '@enact/agate/Divider';

import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Divider.displayName = 'Divider';
const Config = mergeComponentMetadata('Divider', Divider, DividerBase);

const prop = {
	spacing: ['', 'normal', 'small', 'medium', 'large', 'none']
};

storiesOf('Agate', module)
	.add(
		'Divider',
		withInfo({
			text: 'The basic Divider'
		})(() => (
			<Divider
				spacing={select('spacing', prop.spacing, Config)}
			>
				{text('children', Divider, 'Divider Text')}
			</Divider>
		))
	);
