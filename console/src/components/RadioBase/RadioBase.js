import Button from '@enact/agate/Button';
import ToggleButton from '@enact/agate/ToggleButton';
import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import React from 'react';
import Marquee from '@enact/ui/Marquee';

import PresetItem from './PresetItem';
import ConsoleButton from './ConsoleButton';

import css from './RadioBase.less';


const RadioBase = kind({
  name: 'Radio',

  render: (props) => (
    <Panel {...props}>
      <div className={css.radio}>
        <div className={css.radioToggle}>
          <ToggleButton small type="grid">AM</ToggleButton> |
          <ToggleButton selected small type="grid">FM</ToggleButton>
        </div>
        <div className={css.title}>
          {/*Radio TextInfo*/}
          <Marquee>93.1 MHZ</Marquee>
          <Marquee>Artist - Song</Marquee>
        </div>
        <div className={css.tuneControls}>
          {/*Tune*/}
          <ConsoleButton icon={"arrowsmallleft"} />
          Tune
          <ConsoleButton icon={"arrowsmallright"} />
        </div>
        <div className={css.scanControls}>
          <ConsoleButton icon={"arrowsmallleft"} />
          Scan
          <ConsoleButton icon={"arrowsmallright"} />
        </div>
        {/*List*/}
        <div className={css.presetList}>
          Presets
          <PresetItem icon="plus">93.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">105.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">88.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">92.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">120.1 MHZ FM</PresetItem>
        </div>
      </div>
    </Panel>
  )
});

export default RadioBase;
