import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import Picker from '@enact/agate/Picker';
import ToggleButton from '@enact/agate/ToggleButton';

// import AppStateConnect from '../../App/AppContextConnect';
import Widget from '../Widget';

import css from './CompactHVAC.less';

const temps = ['HI', '74°', '73°', '72°', '71°', '70°', '69°', '68°', '67°', '66°', 'LO'];

const CompactHvacBase = kind({
	name: 'CompactHVAC',

	propTypes: {
		temp: PropTypes.number
	},

	defaultProps: {
		temp: 73
	},

	styles: {
		css,
		className: 'compactHvac'
	},

	render: ({temp, ...rest}) => (
		<Widget {...rest} title="A/C" description="Air conditioning and seat warmers" view="hvac">
			{(temp >= 66 && temp <= 74) && <div>
				<Row className={css.row} align="center space-around">
					<Cell component={ToggleButton} size="30%" type="grid" className={css.button}>A/C</Cell>
					<Cell component={ToggleButton} size="30%" type="grid" className={css.button}>AUTO</Cell>
				</Row>
				<Row className={css.row} align="center space-around">
					<Cell shrink><ToggleButton icon="airdown" /></Cell>
					<Cell shrink><ToggleButton icon="airup" /></Cell>
					<Cell shrink><ToggleButton icon="airright" /></Cell>
				</Row>
			</div>}
			{(temp < 66) && <div>
				<Row align="center space-around">
					<Cell shrink><ToggleButton icon="heatseatleft" type="grid" className={css.button} underline /></Cell>
					<Cell shrink><ToggleButton icon="heatseatright" type="grid" className={css.button} underline /></Cell>
					<Cell shrink><ToggleButton icon="defrosterback" /></Cell>
					<Cell shrink><ToggleButton icon="defrosterfront" /></Cell>
				</Row>
				<Picker orientation="vertical" className={css.picker}>{temps}</Picker>
			</div>}
			{(temp > 74) && <div>
				<Row align="center space-around">
					<Cell shrink><ToggleButton type="grid" icon="aircirculation" className={css.button} /></Cell>
				</Row>
			</div>}
		</Widget>
	)
});

// For the purposes of the demo, we'll just have a static value for the temperature.
//
// const CompactHvac = AppStateConnect(({weather}) => ({
// 	// SUPER Safely fetch the temperature
// 	temp: (weather && weather.current && weather.current.main && weather.current.main.temp)
// }))(CompactHvacBase);

export default CompactHvacBase;
