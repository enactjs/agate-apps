import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import {LabeledItemBase} from '@enact/agate/LabeledItem';
import {Panel} from '@enact/agate/Panels';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import React, {Component} from 'react';

import PresetItem from '../components/PresetItem';

import css from './Radio.less';


const RadioBase = kind({
  name: 'Radio',

  handlers: {
    onFrequencyToggle: (ev, {changeFrequency}) => {
      const frequency = ev.currentTarget.innerText.trim();
      changeFrequency(frequency);
    },
    onPresetClick: (ev, {changeStation, presets}) => {
      const presetIndex = ev.currentTarget.getAttribute('preset');
      changeStation(presets[presetIndex]);
    },
    onPresetDown: (ev, {changePreset}) => {
      const presetIndex = ev.currentTarget.getAttribute('preset');
      changePreset(presetIndex);
    },
    onPresetHold: (ev, {currentStation, currentPreset, updatePresets}) => {
      updatePresets(currentStation, currentPreset);
    },
    onTune: (ev, {currentStation, changeStation}) => {
      const action = ev.currentTarget.getAttribute('action');
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

  render: ({currentStation, frequency, presets, onFrequencyToggle, onPresetClick, onPresetDown, onPresetHold, onTune}) => (
    <Panel>
      <div className={css.radio}>
        <div className={css.radioToggle}>
          <ToggleButton onClick={onFrequencyToggle} selected={frequency === 'AM'} small type="grid">AM</ToggleButton> |
          <ToggleButton onClick={onFrequencyToggle} selected={frequency === 'FM'} small type="grid">FM</ToggleButton>
        </div>
        <div className={css.title}>
          {/*Radio TextInfo*/}
          <LabeledItemBase label="Artist - Song">{currentStation} MHZ</LabeledItemBase>
        </div>
        <div className={css.tuneControls}>
          {/*Tune*/}
          <Button onClick={onTune} action="tune-down" icon={"arrowsmallleft"} />
          Tune
          <Button onClick={onTune} action="tune-up" icon={"arrowsmallright"} />
        </div>
        <div className={css.scanControls}>
          <Button onClick={onTune} action="scan-down" icon={"arrowsmallleft"} />
          Scan
          <Button onClick={onTune} action="scan-up" icon={"arrowsmallright"} />
        </div>
        {/*List*/}
        <div className={css.presetList}>
          Presets
          <Divider startSection />
          <PresetItem
            label="Station 1"
            onClick={onPresetClick}
            onDown={onPresetDown}
            onHold={onPresetHold}
            preset="0"
          >
            {presets[0]} MHZ
          </PresetItem>
          <PresetItem
            label="Station 2"
            onClick={onPresetClick}
            onDown={onPresetDown}
            onHold={onPresetHold}
            preset="1"
          >
            {presets[1]} MHZ
          </PresetItem>
          <PresetItem
            label="Station 3"
            onClick={onPresetClick}
            onDown={onPresetDown}
            onHold={onPresetHold}
            preset="2"
          >
            {presets[2]} MHZ
          </PresetItem>
          <PresetItem
            label="Station 4"
            onClick={onPresetClick}
            onDown={onPresetDown}
            onHold={onPresetHold}
            preset="3"
          >
            {presets[3]} MHZ
          </PresetItem>
          <PresetItem
            label="Station 5"
            onClick={onPresetClick}
            onDown={onPresetDown}
            onHold={onPresetHold}
            preset="4"
          >
            {presets[4]} MHZ
          </PresetItem>
        </div>
      </div>
    </Panel>
  )
});

class Radio extends Component {
  constructor() {
    super();

    this.state = {
      currentPreset: 0,
      currentStation: 87.8,
      frequency: 'FM',
      presets: [93.1, 105.1, 88.1, 92.1, 120.1]
    }
  }

  changeFrequency = (frequency) => {
    this.setState({frequency});
  }

  changePreset = (index) => {
    this.setState({currentPreset: index});
  }

  changeStation = (station, index) => {
    this.setState({currentStation: station});
  }

  updatePresets = (station, index) => {
    const updatedPresets = this.state.presets.map((presetStation, currentIndex) => {
      if (parseInt(index) === currentIndex) {
        return station;
      } else {
        return presetStation;
      }
    });

    this.setState({presets: updatedPresets});
  }

  render() {
    return (
      <RadioBase
        changeFrequency={this.changeFrequency}
        changePreset={this.changePreset}
        changeStation={this.changeStation}
        currentPreset={this.state.currentPreset}
        currentStation={this.state.currentStation}
        frequency={this.state.frequency}
        presets={this.state.presets}
        updatePresets={this.updatePresets}
      />
    )
  }
}

export default Radio;
