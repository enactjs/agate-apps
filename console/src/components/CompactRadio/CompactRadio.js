import Button from '@enact/agate/Button';
import {LabeledItemBase} from '@enact/agate/LabeledItem';
import IncrementSlider from '@enact/agate/IncrementSlider';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import React, {Component} from 'react';

import css from './CompactRadio.less';


const CompactRadioBase = kind({
	name: 'CompactRadio',

	styles: {
		className: 'radio-compact'
	},

	handlers: {
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

	render: ({currentStation, onTune}) => (
    	<div className={css.compact}>
			<Cell><LabeledItemBase css={css.label} label="Artist - Song">{currentStation} MHZ</LabeledItemBase></Cell>
      		<Row className={css.row}>
				<Cell><Button onClick={onTune} action="tune-down" icon={"arrowsmallleft"} /></Cell>
				Tune
				<Cell><Button onClick={onTune} action="tune-up" icon={"arrowsmallright"} /></Cell>
			</Row>
			<Row className={css.row}>
				<Cell><IncrementSlider
				  defaultValue={15}
					max={30}
					min={0}
					step={1}
				/></Cell>
			</Row>
		</div>
	)
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

	changeStation = (station) => {
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
			<CompactRadioBase
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
