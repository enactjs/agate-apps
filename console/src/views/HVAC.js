import Divider               from '@enact/agate/Divider';
import {Panel}               from '@enact/agate/Panels';
import Picker                from '@enact/agate/Picker';
import SliderButton          from '@enact/agate/SliderButton';
import ToggleButton          from '@enact/agate/ToggleButton';
import kind                  from '@enact/core/kind';
import {Row}                 from '@enact/ui/Layout';
import React                 from 'react';

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
			<Divider>
				Fan Speed
			</Divider>
			<SliderButton>
				{'Off'}
				{'Low'}
				{'Medium'}
				{'High'}
			</SliderButton>
			<Row className={css.above} align="center space-around">
				<ToggleButton icon="heatseatleft" type="grid" className={css.button} underline />
				<ToggleButton type="grid" className={css.button}>A/C</ToggleButton>
				<ToggleButton icon="heatseatright" type="grid" className={css.button} underline />
			</Row>
			<Row className={css.below} align="center space-around">
				<Picker orientation="vertical" className={css.picker}>
					{temps}
				</Picker>
				<div className={css.stackedButtons}>
					<ToggleButton type="grid" className={css.button}>AUTO</ToggleButton>
					<ToggleButton type="grid" icon="aircirculation" className={css.button} />
				</div>
				<Picker orientation="vertical" className={css.picker}>
					{temps}
				</Picker>
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
