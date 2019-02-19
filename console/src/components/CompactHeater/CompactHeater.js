import React from 'react';
import PropTypes from 'prop-types';
// import ToggleButton from '@enact/agate/ToggleButton';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import Skinnable from '@enact/agate/Skinnable';
import kind from '@enact/core/kind';
import {Cell} from '@enact/ui/Layout';

import AppStateConnect from '../../App/AppContextConnect';
import Widget from '../Widget';

import css from './CompactHeater.module.less';

const CompactHeaterBase = kind({
	name: 'CompactHeater',

	propTypes: {
		updateAppState: PropTypes.func.isRequired,
		leftHeat: PropTypes.bool,
		onToggleLeftHeater: PropTypes.func,
		onToggleRightHeater: PropTypes.func,
		rightHeat: PropTypes.bool
	},

	styles: {
		css,
		className: 'compactHeater'
	},

	handlers: {
		onToggleLeftHeater: (ev, {updateAppState}) => {
			updateAppState((state) => {
				const heat = state.userSettings.climate.leftHeat;
				state.userSettings.climate.leftHeat = !heat;
			});
		},
		onToggleRightHeater: (ev, {updateAppState}) => {
			updateAppState((state) => {
				const heat = state.userSettings.climate.rightHeat;
				state.userSettings.climate.rightHeat = !heat;
			});
		}
	},

	computed: {
		leftStatus: ({leftHeat, styler}) => <span className={styler.join('status', {on: leftHeat})}>{leftHeat ? 'ON' : 'OFF'}</span>,
		rightStatus: ({rightHeat, styler}) => <span className={styler.join('status', {on: rightHeat})}>{rightHeat ? 'ON' : 'OFF'}</span>
	},

	render: ({leftHeat, leftStatus, onToggleLeftHeater, onToggleRightHeater, rightHeat, rightStatus, ...rest}) => {
		delete rest.updateAppState;
		return (

			<Widget {...rest} title="Heated Seats" description="Warm up the seats" view="hvac" align="center space-around" orientation="horizontal">
				<Cell shrink>
					<LabeledIconButton
						icon="heatseatleft"
						onClick={onToggleLeftHeater}
						selected={leftHeat}
					>
						Left: {leftStatus}
					</LabeledIconButton>
				</Cell>
				<Cell shrink>
					<LabeledIconButton
						icon="heatseatright"
						onClick={onToggleRightHeater}
						selected={rightHeat}
					>
						Right: {rightStatus}
					</LabeledIconButton>
				</Cell>
			</Widget>
		);
		// {/* <Row>*/}
		// <Cell shrink>
		// 	<Row align="center space-around">
		// 		<Cell shrink><ToggleButton icon="heatseatleft" onClick={onToggleLeftHeater} selected={leftHeat} underline /></Cell>
		// 		<Cell shrink><ToggleButton icon="heatseatright" onClick={onToggleRightHeater} selected={rightHeat} underline /></Cell>
		// 	</Row>
		// </Cell>
		// <Cell shrink>
		// 	<Row align="center space-around">
		// 		<Cell shrink>Left: {leftStatus}</Cell>
		// 		<Cell shrink>Right: {rightStatus}</Cell>
		// 	</Row>
		// </Cell>
		// {/* </Row>*/}
	}
});

const CompactHeater = AppStateConnect(({userSettings: {climate}, updateAppState}) => ({
	leftHeat: (climate && climate.leftHeat),
	rightHeat: (climate && climate.rightHeat),
	updateAppState
}))(Skinnable(CompactHeaterBase));

export default CompactHeater;
