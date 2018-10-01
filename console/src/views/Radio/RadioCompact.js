import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import {LabeledItemBase} from '@enact/agate/LabeledItem';
import {Panel} from '@enact/agate/Panels';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import React, {Component} from 'react';

import PresetItem from '../../components/PresetItem';

import css from './Radio.less';


const RadioBase = kind({
	name: 'Radio',

  styles: {
    className: 'radio-compact'
  },

	handlers: {
		onFrequencyToggle: (ev, {changeFrequency}) => {
			const frequency = ev.currentTarget.innerText.trim();
			changeFrequency(frequency);
		},
		onPresetClick: (ev, {changeStation, presets}) => {
			changeStation(presets[ev.presetIndex]);
		},
		onPresetDown: (ev, {changePreset}) => {
			changePreset(ev.presetIndex);
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

	render: ({currentStation, frequency, presets, onFrequencyToggle, onPresetClick, onPresetDown, onPresetHold, onTune}) => {
      return <div className={css.compact}>
					<Cell><LabeledItemBase css={css.label} label="Artist - Song">{currentStation} MHZ</LabeledItemBase></Cell>
        <Row className={css.row}>
					<Cell><Button onClick={onTune} action="tune-down" icon={"arrowsmallleft"} /></Cell>
					Tune
					<Cell><Button onClick={onTune} action="tune-up" icon={"arrowsmallright"} /></Cell>
        </Row>
        <Row className={css.row}>
					<Cell><Button onClick={onTune} action="scan-down" icon={"arrowsmallleft"} /></Cell>
					Scan
					<Cell><Button onClick={onTune} action="scan-up" icon={"arrowsmallright"} /></Cell>
				</Row>
			</div>
	}
});

class RadioCompact extends Component {
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

export default RadioCompact;
