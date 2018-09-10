import Divider               from '@enact/agate/Divider';
import {Panel}               from '@enact/agate/Panels';
import SliderButton          from '@enact/agate/SliderButton';
import ToggleButton          from '@enact/agate/ToggleButton';
import kind                  from '@enact/core/kind';
import {Row, Cell}           from '@enact/ui/Layout';
import React                 from 'react';

import css                   from './HVAC.less';

const Hvac = kind({
	name: 'HVAC',

	styles: {
		css,
		className: 'hvac'
	},

	render: (props) => (
		<Panel {...props}>
			<Divider>
				Fan Speed
			</Divider>
			<SliderButton>
				{'Off'}
				{'Low'}
				{'Medium'}
				{'High'}
			</SliderButton>
			<Row className={css.above + ' ' + css.spaced}>
				<ToggleButton icon="heatseatleft" type="grid" className={css.button} toggleIndicator />
				<ToggleButton type="grid" className={css.button}>A/C</ToggleButton>
				<ToggleButton icon="heatseatright" type="grid" className={css.button} toggleIndicator />
			</Row>
			<Row className={css.below + ' ' + css.spaced}>
				<Cell>
					Picker
				</Cell>
				<div className={css.stackedButtons}>
					<ToggleButton type="grid" className={css.button}>AUTO</ToggleButton>
					<ToggleButton type="grid" icon="aircirculation" className={css.button} />
				</div>
				<Cell>
					Picker
				</Cell>
			</Row>
			<Row className={css.spaced}>
				<ToggleButton icon="airdown" />
				<ToggleButton icon="airup" />
				<ToggleButton icon="airright" />
				<ToggleButton icon="defrosterback" />
				<ToggleButton icon="defrosterfront" />
			</Row>
		</Panel>
	)
});

export default Hvac;
export {
	Hvac as App,
	Hvac
};
