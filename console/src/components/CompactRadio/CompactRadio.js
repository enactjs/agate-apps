import React, {Component} from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import Button from '@enact/agate/Button';
import {LabeledItemBase} from '@enact/agate/LabeledItem';
import IncrementSlider from '@enact/agate/IncrementSlider';

import css from './CompactRadio.less';

const CompactRadioBase = kind({
	name: 'CompactRadio',

	propTypes: {
		changeStation: PropTypes.func,
		currentStation: PropTypes.number
	},

	styles: {
		css,
		className: 'compactRadio'
	},

	handlers: {
		onTune: (ev, {currentStation, changeStation}) => {
			const action = ev.currentTarget.getAttribute('action');
			let newStation;

			if (action === 'tune-up') {
				if (currentStation >= 108) {
					newStation = 87.8;
				} else {
					newStation = (currentStation * 10 + 1) / 10;
				}
			} else if (action === 'tune-down') {
				if (currentStation <= 87.8) {
					newStation = 108;
				} else {
					newStation = (currentStation * 10 - 1) / 10;
				}
			} else if (action === 'scan-up') {
				if (currentStation >= 108) {
					newStation = 87.8;
				} else {
					newStation = (currentStation * 10 + 20) / 10;
				}
			} else if (action === 'scan-down') {
				if (currentStation <= 87.8) {
					newStation = 108;
				} else {
					newStation = (currentStation * 10 - 20) / 10;
				}
			}
			changeStation(newStation);
		}
	},

	render: ({currentStation, onTune, ...rest}) => {
		delete rest.changeStation;
		return (
			<div {...rest}>
				<LabeledItemBase className={css.title} label="Artist - Song">{currentStation} MHz</LabeledItemBase>
				<Row align="center space-between" className={css.row}>
					<Cell shrink>
						<Button onClick={onTune} action="tune-down" icon="arrowsmallleft" />
					</Cell>
					Tune
					<Cell shrink>
						<Button onClick={onTune} action="tune-up" icon="arrowsmallright" />
					</Cell>
				</Row>
				<IncrementSlider
					defaultValue={15}
					max={30}
					min={0}
					step={1}
				/>
			</div>
		);
	}
});

class RadioCompact extends Component {
	constructor () {
		super();

		this.state = {
			currentPreset: 0,
			currentStation: 87.8,
			frequency: 'FM',
			presets: [93.1, 105.1, 88.1, 92.1, 120.1]
		};
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
		this.setState(({presets}) => {
			const updatedPresets = presets.map((presetStation, currentIndex) => {
				if (parseInt(index) === currentIndex) {
					return station;
				} else {
					return presetStation;
				}
			});

			return {presets: updatedPresets};
		});
	}

	render () {
		return (
			<CompactRadioBase
				// changeFrequency={this.changeFrequency}
				// changePreset={this.changePreset}
				changeStation={this.changeStation}
				// currentPreset={this.state.currentPreset}
				currentStation={this.state.currentStation}
				// frequency={this.state.frequency}
				// presets={this.state.presets}
				// updatePresets={this.updatePresets}
			/>
		);
	}
}

export default RadioCompact;
