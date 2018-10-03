import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels'
import ColorPicker from '@enact/agate/ColorPicker';
import {Row, Column, Cell} from '@enact/ui/Layout';
import SliderButton from '@enact/agate/SliderButton';
import Divider from '@enact/agate/Divider';
import viewCss from './Settings.less';

import AppContextConnect from '../App/AppContextConnect';
import LabeledIconButton from '@enact/agate/LabeledIconButton';

const DisplaySettings = kind({
	name: 'DisplaySettings',

	styles: {
		css: viewCss,
		className: 'settingsView'
	},

	handlers: {
		onSelect: (ev, {onSelect}) => {
			onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
		}
	},

	render: ({css, onSelect, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit" align=" center">
				<Cell
					className={css.content}
					component={Column}
					size="50%"
				>
					<Cell
						size="80%"
					>
						<Row align=" flex-end">
							<Cell shrink>
								<LabeledIconButton onClick={onSelect} data-tabindex={4} icon="arrowhookleft">
									Back
								</LabeledIconButton>
							</Cell>
						</Row>
						<Cell
							className={css.header}
							component={Divider}
							shrink
							spacing="medium"
						>
							Display Settings
						</Cell>
						<Cell>
							<Cell>
								<ColorPickerSetting />
							</Cell>
							<Cell>
								<FontSizeSetting />
							</Cell>
						</Cell>
					</Cell>
				</Cell>
			</Row>
		</Panel>
	)
})

// Example to show how to optimize rerenders.
const ColorPickerItem = kind({
	name: 'ColorPickerItem',

	render: ({color, changeColor}) => (
		<React.Fragment>
			<label>Color:</label>
			<br/>
			<ColorPicker value={color} onChange={changeColor} />
		</React.Fragment>
	)
})

const FontSizeItem = kind({
	name: 'FontSizeItem',

	render: ({changeFontSize, fontSize}) => (
		<React.Fragment>
			<label>Text Size:</label>
			<SliderButton
				onChange={changeFontSize}
				value={fontSize}
			>
				{['S', 'M', 'L', 'XL']}
			</SliderButton>
		</React.Fragment>
	)
})

const ColorPickerSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	color: userSettings.color,
	changeColor: ({value}) => {
		updateAppState((draft) => {
				draft.userSettings.color = value;
			}
		);
	}
}))(ColorPickerItem)

const FontSizeSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	fontSize: userSettings.fontSize,
	changeFontSize: ({value}) => {
		updateAppState((draft) => {
				draft.userSettings.fontSize = value;
			}
		)
	}
}))(FontSizeItem)

export default DisplaySettings;
