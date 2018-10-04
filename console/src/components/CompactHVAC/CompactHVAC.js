import React from 'react';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import Picker from '@enact/agate/Picker';
import ToggleButton from '@enact/agate/ToggleButton';
import {LabeledItemBase} from '@enact/agate/LabeledItem';

import css from './CompactHVAC.less';

const temps = ['HI', '74°', '73°', '72°', '71°', '70°', '69°', '68°', '67°', '66°', 'LO'];

const CompactHvac = kind({
	name: 'CompactHVAC',

	styles: {
		css,
		className: 'compactHvac'
	},

	defaultProps: {
		temp: 73
	},

	render: ({temp, ...rest}) => (
		<div {...rest}>
			<LabeledItemBase className={css.title} label="Mostly sunny">{temp}°</LabeledItemBase>
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
		</div>
	)
});

export default CompactHvac;
