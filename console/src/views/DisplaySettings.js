import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import ColorPicker from '@enact/agate/ColorPicker';
import {Row, Column, Cell} from '@enact/ui/Layout';
import UiLabeledIcon from '@enact/ui/LabeledIcon';
import SliderButton from '@enact/agate/SliderButton';
import Divider from '@enact/agate/Divider';

import AppContextConnect from '../App/AppContextConnect';
import LabeledIconButton from '@enact/agate/LabeledIconButton';

import viewCss from './Settings.less';

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
								<Row align="start space-evenly">
									<AccentColorSetting>Accent Color</AccentColorSetting>
									<HighlightColorSetting>Highlight Color</HighlightColorSetting>
								</Row>
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
});

// Example to show how to optimize rerenders.
const ColorPickerItem = kind({
	name: 'ColorPickerItem',

	render: ({color, updateColor, ...rest}) => (
		UiLabeledIcon.inline({
			...rest,
			iconComponent: (props) => (
				<ColorPicker {...props} value={color} onChange={updateColor} />
			)
		})
	)
});

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
});

const AccentColorSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	color: userSettings.colorAccent,
	updateColor: ({value}) => {
		updateAppState((state) => {
			state.userSettings.colorAccent = value;
		});
	}
}))(ColorPickerItem);

const HighlightColorSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	color: userSettings.colorHighlight,
	updateColor: ({value}) => {
		updateAppState((state) => {
			state.userSettings.colorHighlight = value;
		});
	}
}))(ColorPickerItem);

const FontSizeSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	fontSize: userSettings.fontSize,
	updateFontSize: ({value}) => {
		updateAppState((state) => {
			state.userSettings.fontSize = value;
		});
	}
}))(FontSizeItem);

export default DisplaySettings;
