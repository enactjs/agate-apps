import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import ColorPicker from '@enact/agate/ColorPicker';
import {Row, Column, Cell} from '@enact/ui/Layout';
import SliderButton from '@enact/agate/SliderButton';
import Divider from '@enact/agate/Divider';

import {getPanelIndexOf} from '../App';
import AppContextConnect from '../App/AppContextConnect';
import LabeledIconButton from '@enact/agate/LabeledIconButton';

import componentCss from './Settings.less';

// Skin setup area
const skinCollection = {
	carbon: 'Carbon',
	copper: 'Copper',
	electro: 'Electro',
	titanium: 'Titanium'
};
const skinList = Object.keys(skinCollection);
const skinNames = skinList.map((skin) => skinCollection[skin]);  // Build the names list based on the skin list array, so the indexes always match up, in case the object keys don't return in the same order.

const swatchPalette = ['#a47d66', '#9cd920', '#559616', '#cecacb', '#566af0', '#0359f0', '#f08c21', '#f25c54', '#f42c04', '#8d0801', '#2e1C2b', '#d636d9', '#aab3cb'];

const FormRow = kind({
	name: 'FormRow',
	styles: {
		css: componentCss,
		className: 'formRow'
	},
	render: ({alignLabel, children, css, label, ...rest}) => (
		<Row align="center" {...rest}>
			<Cell component="label" className={css.label} align={alignLabel} size="20%">{label}</Cell>
			{children}
		</Row>
	)
});

const ColorPickerItem = kind({
	name: 'ColorPickerItem',

	render: ({label, ...rest}) => (
		<Cell style={{textAlign: 'center'}}>
			<ColorPicker {...rest} />
			<label style={{display: 'block'}}>{label}</label>
		</Cell>
	)
});

const SliderButtonItem = kind({
	name: 'SliderButtonItem',
	styles: {
		css: componentCss,
		className: 'sliderButtonRow'
	},
	render: ({alignLabel, label, ...rest}) => (
		<FormRow alignLabel={alignLabel} label={label}>
			<Cell><SliderButton {...rest} /></Cell>
		</FormRow>
	)
});



const DisplaySettings = kind({
	name: 'DisplaySettings',

	styles: {
		css: componentCss,
		className: 'settingsView'
	},

	handlers: {
		onSelect: (ev, {onSelect}) => {
			onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
		}
	},

	render: ({css, onSelect, ...rest}) => (
		<Panel {...rest}>
			<Row align=" start">
				<Cell shrink>
					<LabeledIconButton onClick={onSelect} labelPosition="after" data-tabindex={getPanelIndexOf('settings')} icon="arrowhookleft">
						Back
					</LabeledIconButton>
				</Cell>
			</Row>
			<Row align=" center">
				<Cell size="70%">
					<Column className={css.content}>
						<Cell
							className={css.header}
							component={Divider}
							shrink
							spacing="medium"
						>
								Display Settings
						</Cell>
						<Cell shrink className={css.spacedItem}>
							<FormRow align="start space-around" alignLabel="center">
								<AccentColorSetting label="Accent Color">{swatchPalette}</AccentColorSetting>
								<HighlightColorSetting label="Highlight Color">{swatchPalette}</HighlightColorSetting>
							</FormRow>
						</Cell>
						<Cell shrink className={css.spacedItem}>
							<SkinSetting label="Skin:">
								{skinNames}
							</SkinSetting>
						</Cell>
						<Cell shrink>
							<FontSizeSetting label="Text Size:">
								{['S', 'M', 'L', 'XL']}
							</FontSizeSetting>
						</Cell>
					</Column>
				</Cell>
			</Row>
		</Panel>
	)
});

// Example to show how to optimize rerenders.
const SaveableSettings = (settingName, propName = 'value') => AppContextConnect(({userSettings, updateAppState}) => ({
	[propName]: userSettings[settingName],
	onChange: ({value}) => {
		updateAppState((state) => {
			state.userSettings[settingName] = value;
		});
	}
}));

// Save the `colorAccent` user setting, read from the default prop (value), of the supplied ColorPickerItem
const AccentColorSetting = SaveableSettings('colorAccent')(ColorPickerItem);

// Save the `colorAccent` user setting, read from the default prop (value), of the supplied ColorPickerItem
const HighlightColorSetting = SaveableSettings('colorHighlight')(ColorPickerItem);

// Save the `colorAccent` user setting, read from the default prop (value), of the supplied SliderButtonItem
const FontSizeSetting = SaveableSettings('fontSize')(SliderButtonItem);

// Make and apply a custom saver that can do additional operations (look ups from a list)
const SkinSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	value: skinList.indexOf(userSettings.skin),
	onChange: ({value}) => {
		updateAppState((state) => {
			state.userSettings.skin = skinList[value].toLowerCase();
		});
	}
}))(SliderButtonItem);


export default DisplaySettings;
