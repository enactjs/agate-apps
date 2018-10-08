import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';

import viewCSS from './Weather.less';

const Weather = kind({
	name: 'Weather',

	styles: {
		css: viewCSS,
		className: ''
	},
	handlers: {},
	computed: {},

	render: ({css, ...rest}) => (
		<Panel {...rest}>
			<div>Weather Page</div>
		</Panel>
	)
});

export default Weather;
