import {Panel}               from '@enact/agate/Panels';
import Picker                from '@enact/agate/Picker';
import kind                  from '@enact/core/kind';
import {Row}                 from '@enact/ui/Layout';
import React                 from 'react';

import '../data/AFB-websock.js';

import css                   from './HVAC.less';

const temps = ['HI', '74°', '73°', '72°', '71°', '70°', '69°', '68°', '67°', '66°', 'LO'];

const Hvac = kind({
	name: 'HVAC',

	styles: {
		css,
		className: 'hvac'
	},

	render: (props) => (
		<Panel {...props}>
			<Row className={css.below} align="center space-around">
				<div>
					Zone 1
					<Picker orientation="vertical" className={css.picker}>
						{temps}
					</Picker>
				</div>
				<div>
					Zone 2
					<Picker orientation="vertical" className={css.picker}>
						{temps}
					</Picker>
				</div>
			</Row>
		</Panel>
	)
});

export default Hvac;
export {
	Hvac as App,
	Hvac
};
