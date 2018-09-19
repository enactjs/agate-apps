import Divider from '@enact/agate/Divider';
import ToggleButton from '@enact/agate/ToggleButton';
import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import React from 'react';
import Marquee from '@enact/ui/Marquee';

import PresetItem from './PresetItem';
import ConsoleButton from './ConsoleButton';
import ConsoleToggleButton from './ConsoleToggleButton';

import css from './RadioBase.less';


const RadioBase = kind({
  name: 'Radio',

  render: (props) => (
    <Panel {...props}>
      <div className={css.radio}>
        <div className={css.radioToggle}>
          <ConsoleToggleButton small type="grid">AM</ConsoleToggleButton> |
          <ConsoleToggleButton selected small type="grid">FM</ConsoleToggleButton>
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
          <Divider startSection />
          <PresetItem label="Station 1" icon="plus">93.1 MHZ FM</PresetItem>
          <PresetItem label="Station 2" icon="plus">105.1 MHZ FM</PresetItem>
          <PresetItem label="Station 3" icon="plus">88.1 MHZ FM</PresetItem>
          <PresetItem label="Station 4" icon="plus">92.1 MHZ FM</PresetItem>
          <PresetItem label="Station 5" icon="plus">120.1 MHZ FM</PresetItem>
        </div>
      </div>
    </Panel>
  )
});

export default RadioBase;
