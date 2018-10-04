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
				<Cell size="40%">
					<Column className={css.content}>
						<Cell size="90%">
							<Cell shrink>
								<Row align=" flex-end">
									<LabeledIconButton onClick={onSelect} data-tabindex={4} icon="arrowhookleft">
										Back
									</LabeledIconButton>
								</Row>
							</Cell>
							<Cell
								className={css.header}
								component={Divider}
								shrink
								spacing="medium"
							>
								Display Settings
							</Cell>
							<Cell shrink>
								<ColorPickerSetting />
							</Cell>
							<Cell shrink>
								<FontSizeSetting />
							</Cell>
						</Cell>
					</Column>
				</Cell>
			</Row>
		</Panel>
	)
})

// Example to show how to optimize rerenders.
const ColorPickerItem = kind({
	name: 'ColorPickerItem',

	render: ({color, updateColor}) => (
		<React.Fragment>
			<label>Color:</label>
			<br/>
			<ColorPicker value={color} onChange={updateColor} />
		</React.Fragment>
	)
})

const FontSizeItem = kind({
	name: 'FontSizeItem',

	render: ({updateFontSize, fontSize}) => (
		<React.Fragment>
			<label>Text Size:</label>
			<SliderButton
				onChange={updateFontSize}
				value={fontSize}
			>
				{['S', 'M', 'L', 'XL']}
			</SliderButton>
		</React.Fragment>
	)
})

const ColorPickerSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	color: userSettings.color,
	updateColor: ({value}) => {
		updateAppState((state) => {
				state.userSettings.color = value;
			}
		);
	}
}))(ColorPickerItem)

const FontSizeSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	fontSize: userSettings.fontSize,
	updateFontSize: ({value}) => {
		updateAppState((state) => {
				state.userSettings.fontSize = value;
			}
		)
	}
}))(FontSizeItem)

export default DisplaySettings;
