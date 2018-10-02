import ColorPicker from '@enact/agate/ColorPicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {text} from '../../src/enact-knobs';

ColorPicker.displayName = 'ColorPicker';

storiesOf('Agate', module)
	.add(
		'ColorPicker',
		withInfo({
			text: 'The basic ColorPicker'
		})(() => (
			<ColorPicker
				onChange={action('onChange')}
				defaultValue={text('defaultValue', ColorPicker, '#3467af')}
			/>
		))
	);
