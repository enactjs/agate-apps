import Divider from '@enact/agate/Divider';
import {Panel} from '@enact/agate/Panels';
import {LabeledItemBase} from '@enact/agate/LabeledItem';
import kind from '@enact/core/kind';
import React, {Component} from 'react';

import PresetItem from '../components/PresetItem';
import ConsoleButton from '../components/ConsoleButton';
import ConsoleToggleButton from '../components/ConsoleToggleButton';

import css from './Radio.less';


const RadioBase = kind({
  name: 'Radio',

  handlers: {
    onFrequencyToggle: (ev, {changeFrequency}) => {
      const frequency = ev.currentTarget.innerText.trim();
      changeFrequency(frequency);
    },
    onPresetClick: (ev, {changeStation, presets}) => {
      const index = parseInt(ev.currentTarget.getAttribute('data-preset'));
      changeStation(presets[index]);
    },
    onTune: (ev, {currentStation, changeStation}) => {
      const action = ev.currentTarget.getAttribute("data-action");
      let newStation;

      if (action === 'tune-up') {
        if (currentStation >= 108) {
          newStation = 87.8;
        } else {
          newStation = (currentStation*10 + 1)/10;
        }
      } else if (action === 'tune-down') {
        if (currentStation <= 87.8) {
          newStation = 108;
        } else {
          newStation = (currentStation*10 - 1)/10;
        }
      } else if (action === 'scan-up') {
        if (currentStation >= 108) {
          newStation = 87.8;
        } else {
          newStation = (currentStation*10 + 20)/10;
        }
      } else if (action === 'scan-down') {
        if (currentStation <= 87.8) {
          newStation = 108;
        } else {
          newStation = (currentStation*10 - 20)/10
        }
      }
      changeStation(newStation);
    }
  },

  render: ({currentStation, frequency, presets, onFrequencyToggle, onPresetClick, onTune}) => {

    return (
      <Panel>
        <div className={css.radio}>
          <div className={css.radioToggle}>
            <ConsoleToggleButton onClick={onFrequencyToggle} selected={frequency === 'AM'} small type="grid">AM</ConsoleToggleButton> |
            <ConsoleToggleButton onClick={onFrequencyToggle} selected={frequency === 'FM'} small type="grid">FM</ConsoleToggleButton>
          </div>
          <div className={css.title}>
            {/*Radio TextInfo*/}
            <LabeledItemBase label="Artist - Song">{currentStation} MHZ</LabeledItemBase>
          </div>
          <div className={css.tuneControls}>
            {/*Tune*/}
            <ConsoleButton onClick={onTune} data-action="tune-down" icon={"arrowsmallleft"} />
            Tune
            <ConsoleButton onClick={onTune} data-action="tune-up" icon={"arrowsmallright"} />
          </div>
          <div className={css.scanControls}>
            <ConsoleButton onClick={onTune} data-action="scan-down" icon={"arrowsmallleft"} />
            Scan
            <ConsoleButton onClick={onTune} data-action="scan-up" icon={"arrowsmallright"} />
          </div>
          {/*List*/}
          <div className={css.presetList}>
            Presets
            <Divider startSection />
            <PresetItem data-preset="0" label="Station 1" icon="plus" onClick={onPresetClick}>{presets[0]} MHZ</PresetItem>
            <PresetItem data-preset="1" label="Station 2" icon="plus" onClick={onPresetClick}>{presets[1]} MHZ</PresetItem>
            <PresetItem data-preset="2" label="Station 3" icon="plus" onClick={onPresetClick}>{presets[2]} MHZ</PresetItem>
            <PresetItem data-preset="3" label="Station 4" icon="plus" onClick={onPresetClick}>{presets[3]} MHZ</PresetItem>
            <PresetItem data-preset="4" label="Station 5" icon="plus" onClick={onPresetClick}>{presets[4]} MHZ</PresetItem>
          </div>
        </div>
      </Panel>
    );
  }
});

class Radio extends Component {
  constructor() {
    super();

    this.state = {
      currentStation: 87.8,
      frequency: 'AM',
      presets: [93.1, 105.1, 88.1, 92.1, 120.1]
    }
  }

  changeFrequency = (frequency) => {
    this.setState({frequency});
  }

  changePreset = (presets) => {
    this.setState({presets});
  }

  changeStation = (station) => {
    this.setState({currentStation: station});
  }

  render() {
    return (
      <RadioBase
        currentStation={this.state.currentStation}
        frequency={this.state.frequency}
        presets={this.state.presets}
        changeFrequency={this.changeFrequency}
        changePreset={this.changePreset}
        changeStation={this.changeStation}
      />
    )
  }
}

export default Radio;
