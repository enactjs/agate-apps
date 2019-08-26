import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import {LabeledItemBase} from '@enact/agate/LabeledItem';
import {Panel} from '@enact/agate/Panels';
import ToggleButton from '@enact/agate/ToggleButton';
import {ResponsiveBox} from '@enact/agate/DropManager';
import Layout, {Row, Cell} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LS2Request from '@enact/webos/LS2Request';

import AppContextConnect from '../App/AppContextConnect';
import PresetItem from '../components/PresetItem';
import CustomLayout, {SaveLayoutArrangement} from '../components/CustomLayout';

import css from './Radio.module.less';

const wrapFrequency = (frequency, factor) => {
	// case 'tune-up':
	// 	newStation = (frequency >= 107.9) ? 88.1 : (frequency * 10 + 2) / 10;
	// 	break;
	// case 'tune-down':
	// 	newStation = (frequency <= 88.1) ? 107.9 : (frequency * 10 - 2) / 10;
	// 	break;

	const min = 88.1,
		max = 107.9,
		newFrequency = ((frequency * 10 + factor) / 10);

	if (newFrequency > max) return min;
	if (newFrequency < min) return max;
	return newFrequency;
};

const ResponsiveTuner = ResponsiveBox(({containerShape, children, onUp, onDown, ...rest}) => {
	const orientation = (containerShape && containerShape.orientation === 'portrait') ? 'vertical' : 'horizontal';
	const vertical = (orientation === 'vertical');
	return (
		<Layout align="center center" orientation={orientation} {...rest}>
			{/* {(console.log({rest: rest}) ? 'test' : null)}*/}
			<Cell shrink component={Button} onClick={vertical ? onUp : onDown} icon={vertical ? 'arrowsmallup' : 'arrowsmallleft'} />
			<Cell shrink className={css.label}>
				{children}
			</Cell>
			<Cell shrink component={Button} onClick={vertical ? onDown : onUp} icon={vertical ? 'arrowsmalldown' : 'arrowsmallright'} />
		</Layout>
	);
});

const stationNames = [
	"Eye of Forgiveness",
	"Forest Frolic Loop",
	"City Sunshine",
	"Funshine",
	"Inspiration"
];

const RadioBase = kind({
	name: 'Radio',

	propTypes: {
		status: PropTypes.string,
		changeStatus: PropTypes.func,
		changeFrequency: PropTypes.func,
		changePreset: PropTypes.func,
		frequency: PropTypes.number,
		onStatusToggle: PropTypes.func,
		onPresetClick: PropTypes.func,
		onPresetDown: PropTypes.func,
		onPresetHold: PropTypes.func,
		preset: PropTypes.number,
		presets: PropTypes.array,
		updatePresets: PropTypes.func
	},

	styles: {
		css,
		className: 'radio'
	},

	handlers: {
		onStatusToggle: (ev, {changeStatus}) => {
			const status = ev.currentTarget.innerText.trim();
			changeStatus(status);
		},
		onPresetClick: (ev, {changeFrequency, presets}) => {
			changeFrequency(presets[ev.presetIndex]);
		},
		onPresetDown: (ev, {changePreset}) => {
			changePreset(ev.presetIndex);
		},
		onPresetHold: (ev, {frequency, preset, updatePresets}) => {
			updatePresets(frequency, preset);
		},
		onTuneUp: (ev, {frequency, changeFrequency}) => changeFrequency(wrapFrequency(frequency, 2)),
		onTuneDown: (ev, {frequency, changeFrequency}) => changeFrequency(wrapFrequency(frequency, -2)),
		onScanUp: (ev, {changeFrequency, changePreset, preset, presets}) => {
			changePreset(preset === presets.length - 1 ? 0 : preset + 1);
			changeFrequency(presets[preset === presets.length - 1 ? 0 : preset + 1]);
		},
		onScanDown: (ev, {changeFrequency, changePreset, preset, presets}) => {
			changePreset(preset === 0 ? presets.length - 1 : preset - 1);
			changeFrequency(presets[preset === 0 ? presets.length - 1 : preset - 1]);
		}
		// onTune: (ev, {frequency, changeFrequency}) => {
		// 	const action = ev.currentTarget.getAttribute('action');
		// 	let newFrequency;

		// 	switch (action) {
		// 		case 'tune-up':
		// 			newFrequency = wrapFrequency(frequency, 1);
		// 			break;
		// 		case 'tune-down':
		// 			newFrequency = wrapFrequency(frequency, -1);
		// 			break;
		// 		case 'scan-up':
		// 			newFrequency = wrapFrequency(frequency, 20);
		// 			break;
		// 		case 'scan-down':
		// 			newFrequency = wrapFrequency(frequency, -20);
		// 			break;
		// 	}

		// 	changeFrequency(newFrequency);
		// }
	},

	render: ({arrangeable, arrangement, onArrange, status, frequency, onStatusToggle, onPresetClick, onPresetDown, onPresetHold, onTuneUp, onTuneDown, onScanUp, onScanDown, presets, ...rest}) => {
		delete rest.changeStatus;
		delete rest.changePreset;
		delete rest.changeFrequency;
		delete rest.preset;
		delete rest.updatePresets;

		const stationName = (status === 'ON') && stationNames[presets.indexOf(frequency)] || "";

		return (
			<Panel {...rest}>
				<CustomLayout arrangeable={arrangeable} arrangement={arrangement} onArrange={onArrange}>
					<topLeft>
						{/* Tune */}
						<ResponsiveTuner onUp={onTuneUp} onDown={onTuneDown} className={css.tune}>
							Tune
						</ResponsiveTuner>
						{/* <ResponsiveLayout align="center center" className={css.tune}>
							<Button onTap={onTuneUp} action="tune-down" icon="arrowsmallleft" />
							<div className={css.label}>Tune</div>
							<Button onTap={onTuneDown} action="tune-up" icon="arrowsmallright" />
						</ResponsiveLayout>*/}
					</topLeft>

					<top>
						{/* Radio TextInfo */}
						<Row align="center space-around" wrap className={css.info}>
							{/* Status Selector */}
							<Cell shrink className={css.radioToggle}>
								<ToggleButton onClick={onStatusToggle} selected={status === 'OFF'} small type="grid">OFF</ToggleButton>|
								<ToggleButton onClick={onStatusToggle} selected={status === 'ON'} small type="grid">ON</ToggleButton>
							</Cell>
							{/* Station Info */}
							<Cell shrink className={css.title}>
								<LabeledItemBase label={stationName}>{frequency} MHZ</LabeledItemBase>
							</Cell>
						</Row>
					</top>

					<topRight>
						{/* Scan */}
						<ResponsiveTuner onUp={onScanUp} onDown={onScanDown} className={css.scan}>
							Scan
						</ResponsiveTuner>
						{/* <ResponsiveLayout align="center center">
							<Button onTap={onScanUp} action="scan-down" icon="arrowsmallleft" />
							<div className={css.label}></div>
							<Button onTap={onScanDown} action="scan-up" icon="arrowsmallright" />
						</ResponsiveLayout>*/}
					</topRight>

					{/* List*/}
					<div className={css.presetList}>
						Presets
						<Divider startSection />
						{['', '', '', '', ''].map((name, index) => (
							<PresetItem
								key={'preset' + index}
								label={name || 'Station ' + (index + 1)}
								onClick={onPresetClick}
								onMouseDown={onPresetDown}
								onHold={onPresetHold}
								preset={index}
							>
								{presets[index]} MHz
							</PresetItem>

						))}
					</div>
				</CustomLayout>
			</Panel>
		);
	}
});

const defaultConfig = {
	preset: 0,
	presets: [88.1, 92.1, 93.1, 105.1, 102.1],
	status: 'OFF'
};

const RadioDecorator = hoc(defaultConfig, (configHoc, Wrapped) => {
	return class extends Component {
		static displayName = RadioDecorator;

		constructor (props) {
			super(props);
			const {frequency, preset, presets, status} = props.radioConfig;
			this.state = {
				frequency: frequency || 88.1,
				preset: preset || configHoc.preset,
				presets: presets || configHoc.presets,
				status: status || configHoc.status
			};

			this.lunaIntervalId = null;
		}

		changePlayStatus = ({frequency = this.state.frequency, preset = this.state.preset, status = this.state.status}) => {
			const {presets} = this.state;
			this.props.updateAppState((state) => {
				state.radioConfig = {frequency, preset, presets, status};
			});

			const
				musicIndex = presets.indexOf(frequency),
				musicName = musicIndex > -1 ? stationNames[musicIndex] : '';

			new LS2Request().send({
				service: 'luna://com.webos.applicationManager',
				method: 'launch',
				parameters: {
					id: "music",
					params: {
						index: (status === "ON") ? musicIndex : -1
					},
					subscribe: false
				}
			});

			// Send a Luna API when music changed
			if (this.lunaIntervalId) {
				clearInterval(this.lunaIntervalId);
			}

			const date = new Date();
			new LS2Request().send({
				service: 'luna://com.webos.service.mcvpclient', // Dummy Luna API
				method: 'sendTelemetry',
				parameters: {
					AppInstanceId: 'music',
					AppName: 'music',
					FeatureName: musicName,
					Status: 'Running',
					Duration: (date - this.props.appStartTime) / 1000,
					AppStartTime: this.props.appStartTime.toISOString(),
					Time: date.toISOString()
				}
			});

			this.lunaIntervalId = setInterval(() => {
				const intervalDate = new Date();
				new LS2Request().send({
					service: 'luna://com.webos.service.mcvpclient', // Dummy Luna API
					method: 'sendTelemetry',
					parameters: {
						AppInstanceId: 'music',
						AppName: 'music',
						FeatureName: musicName,
						Status: 'Running',
						Duration: (intervalDate - this.props.appStartTime) / 1000,
						AppStartTime: this.props.appStartTime.toISOString(),
						Time: intervalDate.toISOString()
					}
				});
			}, 5000);
		}

		changeStatus = (status) => {
			this.setState({status});
			this.changePlayStatus({status});
		}

		changePreset = (preset) => {
			this.setState({preset}, () => {
				this.changePlayStatus({preset});
			});
		}

		changeFrequency = (frequency) => {
			this.setState({frequency});
			this.changePlayStatus({frequency});
		}

		updatePresets = (frequency, index) => {
			this.setState(({presets}) => {
				const updatedPresets = presets.map((presetStation, currentIndex) => {
					if (parseInt(index) === currentIndex) {
						return frequency;
					} else {
						return presetStation;
					}
				});
				return {presets: updatedPresets};
			});
		}

		render () {
			const {...rest} = this.props;

			delete rest.radioConfig;
			delete rest.updateAppState;

			return (
				<Wrapped
					{...rest}
					changeStatus={this.changeStatus}
					changePreset={this.changePreset}
					changeFrequency={this.changeFrequency}
					preset={this.state.preset}
					frequency={this.state.frequency}
					status={this.state.status}
					presets={this.state.presets}
					updatePresets={this.updatePresets}
				/>
			);
		}
	};
});

const Radio = AppContextConnect(({appState, radioConfig, updateAppState}) => ({
	appStartTime: appState.appStartTime,
	radioConfig,
	updateAppState
}))(SaveLayoutArrangement('radio')(RadioDecorator(RadioBase)));

export default Radio;
export {
	Radio,
	RadioBase,
	RadioDecorator
};
