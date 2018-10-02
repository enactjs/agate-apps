import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels'
import ColorPicker from '@enact/agate/ColorPicker';
import {Row, Column, Cell} from '@enact/ui/Layout';
import SliderButton from '@enact/agate/SliderButton';
import Divider from '@enact/agate/Divider';
import viewCss from './Settings.less';

import AppStateConnect from '../App/AppContextConnect';

const DisplaySettings = kind({
	name: 'DisplaySettings',

	styles: {
		css: viewCss,
		className: 'settingsView'
	},

	render: ({css, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit">
				<Cell />
				<Cell
					className={css.content}
					component={Column}
				>
					<Cell />
					<Cell
						className={css.header}
						component={Divider}
						shrink
						spacing="small"
					>
						Display Settings
					</Cell>
					<Cell>
						<ColorPickerSetting />
					</Cell>
					<Cell>
						<FontSizeSetting />
					</Cell>
					<Cell />
				</Cell>
				<Cell />
			</Row>
		</Panel>
	)
})

// Example to show how to optimize rerenders.
const ColorPickerItem = kind({
	name: 'ColorPickerItem',

	handlers: {
		changeColor: ({value}, {updateAppState}) =>{
			updateAppState((draft) => {
				draft.userSettings.color = value;
			});
		}
	},

	render: ({color, changeColor}) => (
		<React.Fragment>
			<p>Color:</p>
			<ColorPicker value={color} onChange={changeColor} />
		</React.Fragment>
	)
})

const FontSizeItem = kind({
	name: 'FontSizeItem',

	handlers: {
		changeFontSize:({value}, {updateAppState}) =>{
			updateAppState((draft) => {
				draft.userSettings.fontSize = value;
			});
		}
	},
	render: ({changeFontSize, fontSize}) => (
		<React.Fragment>
			<p>Text Size:</p>
			<SliderButton
				onChange={changeFontSize}
				value={fontSize}
			>
				{['S', 'M', 'L', 'XL']}
			</SliderButton>
		</React.Fragment>
	)
})

const ColorPickerSetting = AppStateConnect((context) => ({
	color: context.userSettings.color,
}))(ColorPickerItem)

const FontSizeSetting = AppStateConnect((context) => ({
	fontSize: context.userSettings.fontSize,
}))(FontSizeItem)

export default DisplaySettings;
