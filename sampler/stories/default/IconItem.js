import IconItem from '@enact/agate/IconItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import iconNames from './icons';
import {boolean, text, select} from '../../src/enact-knobs';
IconItem.displayName = 'IconItem';

storiesOf('Agate', module)
	.add(
		'IconItem',
		withInfo({
			text: 'Basic usage of IconItem'
		})(() => (
			<IconItem
				label={text('label', IconItem, 'Label')}
				disabled={boolean('disabled', IconItem)}
				icon={select('icon', ['', ...iconNames], IconItem, 'circle')}
				titleIcon={select('titleIcon', ['', ...iconNames], IconItem, '')}
			>
				{text('children', IconItem, 'Hello IconItem')}
			</IconItem>
		))
	);
