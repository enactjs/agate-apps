import Divider from '@enact/agate/Divider';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import Layout, {Cell, Row} from '@enact/ui/Layout';
import {Panel} from '@enact/agate/Panels';
import Picker from '@enact/agate/Picker';
import React from 'react';
import {ResponsiveBox} from '@enact/agate/DropManager';
import SliderButton from '@enact/agate/SliderButton';
import ToggleButton from '@enact/agate/ToggleButton';

import CustomLayout, {SaveLayoutArrangement} from '../components/CustomLayout';

import css from './HVAC.less';

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

	render: ({acSelected, arrangeable, arrangement, autoSelected, onArrange, onToggleAc, onToggleAuto, speeds, temps, ...rest}) => (
		<Panel {...rest}>
			<CustomLayout arrangeable={arrangeable} arrangement={arrangement} onArrange={onArrange}>
				<top>
					<Divider>
						Fan Speed
					</Divider>
					<SliderButton disabled={autoSelected}>
						{speeds}
					</SliderButton>
				</top>
				<Row className={css.above} align="center space-around">
					<Cell
						className={css.button}
						component={ToggleButton}
						icon="heatseatleft"
						shrink
						type="grid"
						underline
					/>
					<Cell
						className={css.button}
						component={ToggleButton}
						onClick={onToggleAc}
						selected={acSelected}
						shrink
						type="grid"
						underline
					>
						A/C
					</Cell>
					<Cell
						className={css.button}
						component={ToggleButton}
						icon="heatseatright"
						shrink
						type="grid"
						underline
					/>
				</Row>
				<Row className={css.below} align="center space-around">
					<Cell
						className={css.picker}
						component={Picker}
						orientation="vertical"
						shrink
					>
						{temps}
					</Cell>
					<Cell
						className={css.stackedButtons}
						shrink
					>
						<ToggleButton
							type="grid"
							className={css.button}
							onClick={onToggleAuto}
							selected={autoSelected}
							underline
						>
							AUTO
						</ToggleButton>
						<ToggleButton
							className={css.button}
							icon="aircirculation"
							type="grid"
						/>
					</Cell>
					<Cell
						className={css.picker}
						component={Picker}
						orientation="vertical"
						shrink
					>
						{temps}
					</Cell>
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

const defaultConfig = {
	acSelected: false,
	autoSelected: false,
	speeds: ['Off', 'Low', 'Medium', 'High'],
	temps: ['HI', '74°', '73°', '72°', '71°', '70°', '69°', '68°', '67°', '66°', 'LO']
};

const HvacDecorator = hoc(defaultConfig, (configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = HvacDecorator;

		constructor (props) {
			super(props);

			this.state = {
				acSelected: configHoc.acSelected,
				autoSelected: configHoc.autoSelected,
				speeds: configHoc.speeds,
				temps: configHoc.temps
			};
		}

		toggleAc = () => {
			this.setState(({acSelected}) => {
				return {acSelected: !acSelected};
			});
		};

		toggleAuto = () => {
			this.setState(({acSelected, autoSelected}) => {
				return {
					acSelected: !autoSelected ? true : acSelected,
					autoSelected: !autoSelected
				};
			});
		};

		render () {
			const props = {
				...this.state,
				onToggleAc: this.toggleAc,
				onToggleAuto: this.toggleAuto
			};
			return (
				<Wrapped
					{...props}
				/>
			);
		}
	}
});

const Hvac = SaveLayoutArrangement('hvac')(HvacDecorator(HvacBase));

export default Hvac;
export {
	Hvac,
	HvacBase
};
