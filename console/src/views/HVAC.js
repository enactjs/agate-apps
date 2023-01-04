import Heading from '@enact/agate/Heading';
import kind from '@enact/core/kind';
import Layout, {Cell, Row} from '@enact/ui/Layout';
import {Panel} from '@enact/agate/Panels';
import Picker from '@enact/agate/Picker';
import {ResponsiveBox} from '@enact/agate/DropManager';
import SliderButton from '@enact/agate/SliderButton';
import ToggleButton from '@enact/agate/ToggleButton';
import PropTypes from 'prop-types';

import AppContextConnect from '../App/AppContextConnect';
import CustomLayout, {SaveLayoutArrangement} from '../components/CustomLayout';

import css from './HVAC.module.less';

const speeds = ['Off', 'Low', 'Medium', 'High'];
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

	propTypes: {
		acSelected: PropTypes.bool,
		arrangeable: PropTypes.bool,
		arrangement: PropTypes.any,
		autoSelected: PropTypes.bool,
		fanSpeed: PropTypes.number,
		leftHeat: PropTypes.bool,
		leftTemp: PropTypes.number,
		onArrange: PropTypes.func,
		onToggleAc: PropTypes.func,
		onToggleAuto: PropTypes.func,
		onToggleLeftHeater: PropTypes.func,
		onToggleRecirculation: PropTypes.func,
		onToggleRightHeater: PropTypes.func,
		onUpdateFanSpeed: PropTypes.func,
		onUpdateLeftTemperature: PropTypes.func,
		onUpdateRightTemperature: PropTypes.func,
		recirculate: PropTypes.bool,
		rightHeat: PropTypes.bool,
		rightTemp: PropTypes.number
	},

	styles: {
		css,
		className: 'hvac'
	},

	render: ({
		acSelected,
		arrangeable,
		arrangement,
		autoSelected,
		fanSpeed,
		leftHeat,
		leftTemp,
		onArrange,
		onToggleAc,
		onToggleAuto,
		onToggleLeftHeater,
		onToggleRecirculation,
		onToggleRightHeater,
		onUpdateFanSpeed,
		onUpdateLeftTemperature,
		onUpdateRightTemperature,
		recirculate,
		rightHeat,
		rightTemp,
		...rest
	}) => (
		<Panel {...rest}>
			<CustomLayout arrangeable={arrangeable} arrangement={arrangement} onArrange={onArrange}>
				<top>
					<Heading>
						Fan Speed
					</Heading>
					<SliderButton
						disabled={autoSelected}
						onChange={onUpdateFanSpeed}
						value={fanSpeed}
					>
						{speeds}
					</SliderButton>
				</top>
				<Row className={css.above} align="center space-around">
					<Cell
						className={css.button}
						component={ToggleButton}
						icon="heatseatleft"
						onClick={onToggleLeftHeater}
						selected={leftHeat}
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
						onClick={onToggleRightHeater}
						selected={rightHeat}
						shrink
						type="grid"
						underline
					/>
				</Row>
				<Row className={css.below} align="center space-around">
					<Cell
						className={css.picker}
						component={Picker}
						onChange={onUpdateLeftTemperature}
						orientation="vertical"
						shrink
						value={leftTemp}
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
							onClick={onToggleRecirculation}
							selected={recirculate}
							type="grid"
							underline
						/>
					</Cell>
					<Cell
						className={css.picker}
						component={Picker}
						onChange={onUpdateRightTemperature}
						orientation="vertical"
						shrink
						value={rightTemp}
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

const Hvac = AppContextConnect(({userSettings: {climate}, updateAppState}) => ({
	// props
	acSelected: climate.acSelected,
	autoSelected: climate.autoSelected,
	fanSpeed: climate.fanSpeed,
	leftHeat: climate.leftHeat,
	leftTemp: climate.leftTemp,
	recirculate: climate.recirculate,
	rightHeat: climate.rightHeat,
	rightTemp: climate.rightTemp,
	// handlers
	onToggleAc: () => {
		updateAppState((state) => {
			const {userSettings: {climate: {acSelected}}} = state;
			state.userSettings.climate.acSelected = !acSelected;
		});
	},
	onToggleAuto: () => {
		updateAppState((state) => {
			const {userSettings: {climate: {acSelected, autoSelected}}} = state;
			// turn on the A/C when enabling AUTO
			state.userSettings.climate.acSelected = !autoSelected ? true : acSelected;
			state.userSettings.climate.autoSelected = !autoSelected;
		});
	},
	onToggleRecirculation: () => {
		updateAppState((state) => {
			const {userSettings: {climate: {recirculate}}} = state;
			state.userSettings.climate.recirculate = !recirculate;
		});
	},
	onToggleLeftHeater: () => {
		updateAppState((state) => {
			const heat = state.userSettings.climate.leftHeat;
			state.userSettings.climate.leftHeat = !heat;
		});
	},
	onToggleRightHeater: () => {
		updateAppState((state) => {
			const heat = state.userSettings.climate.rightHeat;
			state.userSettings.climate.rightHeat = !heat;
		});
	},
	onUpdateFanSpeed: ({value}) => {
		updateAppState((state) => {
			state.userSettings.climate.fanSpeed = value;
		});
		return true;
	},
	onUpdateLeftTemperature: ({value}) => {
		updateAppState((state) => {
			state.userSettings.climate.leftTemp = value;
		});
	},
	onUpdateRightTemperature: ({value}) => {
		updateAppState((state) => {
			state.userSettings.climate.rightTemp = value;
		});
	}
}))(SaveLayoutArrangement('hvac')(HvacBase));

export default Hvac;
export {
	Hvac,
	HvacBase
};
