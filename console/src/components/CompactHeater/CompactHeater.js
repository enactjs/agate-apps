import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@enact/agate/Divider';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import {Cell, Column, Row} from '@enact/ui/Layout';

import AppStateConnect from '../../App/AppContextConnect';

import css from './CompactHeater.less';

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
		leftStatus: ({leftHeat}) => leftHeat ? 'on' : 'off',
		rightStatus: ({rightHeat}) => rightHeat ? 'on' : 'off'
	},

	render: ({leftHeat, leftStatus, onToggleLeftHeater, onToggleRightHeater, rightHeat, rightStatus, ...rest}) => {
		delete rest.updateAppState;
		return (
			<div {...rest}>
				<Column>
					<Cell component={Divider} shrink>Heated Seats</Cell>
					<Cell>
						<Row align="center space-around">
							<Cell shrink><ToggleButton icon="heatseatleft" onClick={onToggleLeftHeater} selected={leftHeat} underline /></Cell>
							<Cell shrink><ToggleButton icon="heatseatright" onClick={onToggleRightHeater} selected={rightHeat} underline /></Cell>
						</Row>
					</Cell>
					<Cell>
						<Row align="center space-around">
							<Cell shrink>Left: {leftStatus}</Cell>
							<Cell shrink>Right: {rightStatus}</Cell>
						</Row>
					</Cell>
				</Column>
			</div>
		);
	}
});

const CompactHeater = AppStateConnect(({userSettings: {climate}, updateAppState}) => ({
	leftHeat: (climate && climate.leftHeat),
	rightHeat: (climate && climate.rightHeat),
	updateAppState
}))(CompactHeaterBase);

export default CompactHeater;
