import Picker                from '@enact/agate/Picker';
import ToggleButton          from '@enact/agate/ToggleButton';
import {LabeledItemBase}     from '@enact/agate/LabeledItem';
import kind                  from '@enact/core/kind';
import {Row}                 from '@enact/ui/Layout';
import React                 from 'react';

import css                   from './CompactHVAC.less';

const temps = ['HI', '74°', '73°', '72°', '71°', '70°', '69°', '68°', '67°', '66°', 'LO'];

const CompactHvac = kind({
	name: 'HVAC',

	styles: {
		css,
		className: 'compact'
	},

  defaultProps: {
    temp: 73
  },

	render: ({temp, ...rest}) => (
    <div className={css.compact} {...rest}>
      <Row><LabeledItemBase label="Mostly sunny">{temp}°</LabeledItemBase></Row>
      {temp >= 66 && temp <= 74 && <div>
        <Row className={css.row} align="center space-around">
          <ToggleButton type="grid" className={css.button}>A/C</ToggleButton>
          <ToggleButton type="grid" className={css.button}>AUTO</ToggleButton>
        </Row>
        <Row className={css.row} align="center space-around">
          <ToggleButton icon="airdown" />
          <ToggleButton icon="airup" />
          <ToggleButton icon="airright" />
        </Row>
      </div>}
      {temp < 66 && <div>
        <ToggleButton icon="heatseatleft" type="grid" className={css.button} underline />
        <ToggleButton icon="heatseatright" type="grid" className={css.button} underline />
        <ToggleButton icon="defrosterback" />
        <ToggleButton icon="defrosterfront" />
        <Picker orientation="vertical" className={css.picker}>
        {temps}
        </Picker>
      </div>}
      {temp > 74 && <div>
        <div className={css.stackedButtons}>
        <ToggleButton type="grid" icon="aircirculation" className={css.button} />
        </div>
      </div>}
		</div>
	)
});

export default CompactHvac;
