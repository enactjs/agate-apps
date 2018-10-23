import Divider from '@enact/agate/Divider';
import {Panel} from '@enact/agate/Panels';
import Picker from '@enact/agate/Picker';
import {ResponsiveBox} from '@enact/agate/DropManager';
import SliderButton from '@enact/agate/SliderButton';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import Layout, {Cell, Row} from '@enact/ui/Layout';
import React from 'react';

import CustomLayout, {SaveLayoutArrangement} from '../components/CustomLayout';

import css from './HVAC.less';

const temps = ['HI', '74°', '73°', '72°', '71°', '70°', '69°', '68°', '67°', '66°', 'LO'];

const ResponsiveLayout = ResponsiveBox(({containerShape, ...rest}) => {
	const orientation = (containerShape.orientation === 'portrait') ? 'vertical' : 'horizontal';
	let axisAlign = 'center';
	if (containerShape.edges.left) axisAlign = 'start';
	if (containerShape.edges.right) axisAlign = 'end';

	return (
		<Layout align={axisAlign + ' space-around'} orientation={orientation} {...rest} />
	);
});

const HvacBase = kind({
	name: 'HVAC',

	styles: {
		css,
		className: 'hvac'
	},

	render: ({arrangement, onArrange, ...rest}) => (
		<Panel {...rest}>
			<CustomLayout arrangement={arrangement} onArrange={onArrange}>
				<top>
					<Divider>
						Fan Speed
					</Divider>
					<SliderButton>
						{['Off', 'Low', 'Medium', 'High']}
					</SliderButton>
				</top>
				<Row className={css.above} align="center space-around">
					<Cell component={ToggleButton} shrink icon="heatseatleft" type="grid" className={css.button} underline />
					<Cell component={ToggleButton} shrink type="grid" className={css.button}>A/C</Cell>
					<Cell component={ToggleButton} shrink icon="heatseatright" type="grid" className={css.button} underline />
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
				<bottom>
					<ResponsiveLayout wrap>
						<Cell component={ToggleButton} className={css.spacedToggles} shrink icon="airdown" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink icon="airup" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink icon="airright" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink icon="defrosterback" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink icon="defrosterfront" />
					</ResponsiveLayout>
				</bottom>
			</CustomLayout>
		</Panel>
	)
});

const Hvac = SaveLayoutArrangement('hvac')(HvacBase);

export default Hvac;
export {
	Hvac,
	HvacBase
};
