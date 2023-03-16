import CheckboxItem from '@enact/agate/CheckboxItem';
import ColorPicker from '@enact/agate/ColorPicker';
import Heading from '@enact/agate/Heading';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import {Panel} from '@enact/agate/Panels';
import SliderButton from '@enact/agate/SliderButton';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';

import {getPanelIndexOf} from '../App';
import AppContextConnect from '../App/AppContextConnect';
import {AppContext} from '../App/AppContextProvider';
import {generateTimestamps, getColorsDayMode, getColorsNightMode, getIndex} from '../utils';

import componentCss from './Settings.module.less';

// Skin setup area
const skinCollection = {
	carbon: 'Carbon',
	cobalt: 'Cobalt',
	copper: 'Copper',
	electro: 'Electro',
	gallium: 'Gallium',
	silicon: 'Silicon',
	titanium: 'Titanium'
};
const skinList = Object.keys(skinCollection);
const skinNames = skinList.map((skin) => skinCollection[skin]);  // Build the names list based on the skin list array, so the indexes always match up, in case the object keys don't return in the same order.
let fakeIndex = 0;
const skinVariantsCollection = {
	'': 'Day',
	night: 'Night'
};
const skinVariantsList = Object.keys(skinVariantsCollection);
const skinVariantsNames = skinVariantsList.map((skinVariants) => skinVariantsCollection[skinVariants]);  // Build the names list based on the skin list array, so the indexes always match up, in case the object keys don't return in the same order.

const swatchPalette = [
	'#e0b094', '#ffffff', '#a47d66', '#be064d',
	'#9cd920', '#559616', '#75d1f0', '#259aa7',
	'#fc7982', '#8c81ff', '#cecacb', '#0359f0',
	'#f08c21', '#f42c04', '#d636d9', '#aab3cb',
	'#ff2d55', '#9e00d8'
];
const timestamps = generateTimestamps(5);

const FormRow = kind({
	name: 'FormRow',
	propTypes: {
		alignLabel: PropTypes.string,
		css: PropTypes.object,
		label: PropTypes.string
	},
	styles: {
		css: componentCss,
		className: 'formRow'
	},
	render: ({alignLabel, children, css, label, ...rest}) => (
		<Row align="center" {...rest}>
			<Cell component="label" className={css.label} align={alignLabel} size="15%">{label}</Cell>
			{children}
		</Row>
	)
});

const ColorPickerItem = kind({
	name: 'ColorPickerItem',

	propTypes: {
		css: PropTypes.object,
		label: PropTypes.string,
		onSelect: PropTypes.func,
		prevIndex: PropTypes.number
	},

	render: ({label, ...rest}) => (
		<Cell style={{textAlign: 'center'}}>
			<ColorPicker {...rest} />
			<label style={{display: 'block'}}>{label}</label>
		</Cell>
	)
});

const SliderButtonItem = kind({
	name: 'SliderButtonItem',
	propTypes: {
		alignLabel: PropTypes.string,
		label: PropTypes.string
	},
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

const ColorCheckboxItem = kind({
	name: 'ColorCheckboxItem',

	styles: {
		css: componentCss,
		className: 'colorCheckboxItem'
	},

	render: ({...rest}) => (
		<FormRow>
			<Cell><CheckboxItem {...rest} /></Cell>
		</FormRow>
	)
});

const ThemeSettingsBase = (props) => {
	const [realTime, setRealTime] = useState(false);
	const {prevIndex, ... rest} = props;
	const context = useContext(AppContext);

	delete rest.onSendSkinSettings;

	const dynamicColorActive = context.userSettings.dynamicColor;

	const handleRealState = useCallback(() => {
		setRealTime(value => !value);
	}, [setRealTime]);

	const handleSelect = useCallback((ev, {onSelect}) => {
		onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
	}, []);

	const onChange = useCallback(() => {
		props.onSendSkinSettings(props);
	}, [props]);

	const accentColors = {};
	const highlightColors = {};

	const accentColorsArray = useMemo(() => {
		const dayColorArray = getColorsDayMode(context.userSettings.colorAccentManual, 72);
		const nightColorArray = getColorsNightMode(context.userSettings.colorAccentManual, 72);
		const array = [...nightColorArray.reverse(), ...dayColorArray, ...dayColorArray.reverse(), ...nightColorArray.reverse()];
		const offset = array.splice(0, 12);

		return [...array, ...offset];
	}, [context.userSettings.colorAccentManual]);

	const highlightColorsArray = useMemo(() => {
		const dayColorArray = getColorsDayMode(context.userSettings.colorHighlightManual, 72);
		const nightColorArray = getColorsNightMode(context.userSettings.colorHighlightManual, 72);
		const array = [...dayColorArray.reverse(), ...nightColorArray, ...nightColorArray.reverse(), ...dayColorArray.reverse()];
		const offset = array.splice(0, 12);

		return [...array, ...offset];
	}, [context.userSettings.colorHighlightManual]);

	timestamps.forEach((element, index) => {
		accentColors[element] = accentColorsArray[index];
	});

	timestamps.forEach((element, index) => {
		highlightColors[element] = highlightColorsArray[index];
	});

	useEffect (() => {
		let changeColor;

		if (dynamicColorActive) {
			// Remove this when fake timers will no longer be used
			context.updateAppState((state) => {
				state.userSettings.colorAccent = context.userSettings.colorAccentManual;
				state.userSettings.colorHighlight = context.userSettings.colorHighlightManual;
				state.userSettings.skinVariants = context.userSettings.skinVariantsManual;
			});

			context.updateAppState((state) => {
				state.userSettings.colorAccentManual = state.userSettings.colorAccent;
				state.userSettings.colorHighlightManual = state.userSettings.colorHighlight;
				state.userSettings.skinVariantsManual = state.userSettings.skinVariants;
			});

			changeColor = setInterval(() => {
				if (realTime) {
					const index = getIndex();
					let skinVariant;
					if (index >= '06:00' && index < '18:00') {
						skinVariant = '';
					} else {
						skinVariant = 'night';
					}

					context.updateAppState((state) => {
						state.userSettings.colorAccent = `${accentColors[index]}`;
						state.userSettings.colorHighlight = `${highlightColors[index]}`;
						state.userSettings.skinVariants = skinVariant;
					});
				} else {
					let skinVariant;
					if (60 <= fakeIndex && fakeIndex <= 203) {
						skinVariant = '';
					} else {
						skinVariant = 'night';
					}

					context.updateAppState((state) => {
						state.userSettings.colorAccent = `${accentColorsArray[fakeIndex]}`;
						state.userSettings.colorHighlight = `${highlightColorsArray[fakeIndex]}`;
						state.userSettings.skinVariants = skinVariant;
					});
					if (fakeIndex < 287) {
						fakeIndex++;
					} else {
						fakeIndex = 0;
					}
				}
			}, realTime ? 30 * 1000 : 100);
		} else {
			context.updateAppState((state) => {
				state.userSettings.colorAccent = context.userSettings.colorAccentManual;
				state.userSettings.colorHighlight = context.userSettings.colorHighlightManual;
				state.userSettings.skinVariants = context.userSettings.skinVariantsManual;
			});
		}

		return () => {
			clearInterval(changeColor);
			fakeIndex = 0;
		};
	}, [context.userSettings.dynamicColor, realTime]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Panel {...rest} className={componentCss.settingsView}>
			<Row align=" start">
				<Cell shrink>
					<LabeledIconButton
						data-tabindex={prevIndex != null ? prevIndex : getPanelIndexOf('settings')}
						icon="arrowlargeleft"
						labelPosition="after"
						onClick={handleSelect}
						size={rest.skin === 'silicon' ? 'small' : 'large'}
					>
						Back
					</LabeledIconButton>
				</Cell>
			</Row>
			<Row align=" center">
				<Cell size="70%">
					<Column className={componentCss.content}>
						<Cell
							component={Heading}
							shrink
							showLine
							spacing="medium"
						>
							Theme
						</Cell>
						<Cell shrink className={componentCss.spacedItem}>
							<FormRow align="start space-around" alignLabel="center" className={componentCss.formRow}>
								<AccentColorSetting disabled={dynamicColorActive} label="Accent Color" onClick={onChange}>{swatchPalette}</AccentColorSetting>
								<HighlightColorSetting disabled={dynamicColorActive} label="Highlight Color" onClick={onChange}>{swatchPalette}</HighlightColorSetting>
							</FormRow>
						</Cell>
						<Cell shrink className={componentCss.spacedItem}>
							<SkinSetting label="Skin:" onClick={onChange}>
								{skinNames}
							</SkinSetting>
						</Cell>
						<Cell shrink className={componentCss.spacedItem}>
							<SkinVariantsSetting disabled={dynamicColorActive} label="Variant:" onClick={onChange}>
								{skinVariantsNames}
							</SkinVariantsSetting>
						</Cell>
						{/* <Cell shrink>
							<FontSizeSetting label="Text Size:">
								{['S', 'M', 'L', 'XL']}
							</FontSizeSetting>
						</Cell>*/}
						<Cell shrink className={componentCss.spacedItem}>
							<DynamicColorSetting>
								Dynamic color change
							</DynamicColorSetting>
							<ColorCheckboxItem onToggle={handleRealState} value={realTime}>
								Use real time
							</ColorCheckboxItem>
						</Cell>
					</Column>
				</Cell>
			</Row>
		</Panel>
	);
};

ThemeSettingsBase.propTypes = {
	alignLabel: PropTypes.string,
	css: PropTypes.object,
	label: PropTypes.string,
	onSelect: PropTypes.func,
	onSendSkinSettings: PropTypes.func,
	prevIndex: PropTypes.number,
	skin: PropTypes.string
};

ThemeSettingsBase.displayName = 'ThemeSettings';

// Example to show how to optimize rerenders.
const SaveableSettings = (settingName, propName = 'value') => AppContextConnect(({userSettings, updateAppState}) => ({
	[propName]: userSettings[settingName],
	onChange: ({value}) => {
		updateAppState((state) => {
			state.userSettings[settingName] = value;
			state.userSettings[settingName + 'Manual'] = value;
		});
	}
}));

// Save the `colorAccent` user setting, read from the default prop (value), of the supplied ColorPickerItem
const AccentColorSetting = SaveableSettings('colorAccent')(ColorPickerItem);

// Save the `colorAccent` user setting, read from the default prop (value), of the supplied ColorPickerItem
const HighlightColorSetting = SaveableSettings('colorHighlight')(ColorPickerItem);

// Save the `colorAccent` user setting, read from the default prop (value), of the supplied SliderButtonItem
// const FontSizeSetting = SaveableSettings('fontSize')(SliderButtonItem);

// Make and apply a custom saver that can do additional operations (look ups from a list)
const SkinSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	value: skinList.indexOf(userSettings.skin),
	onChange: ({value}) => {
		updateAppState((state) => {
			state.userSettings.skin = skinList[value].toLowerCase();
		});
	}
}))(SliderButtonItem);

const SkinVariantsSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	value: skinVariantsList.indexOf(userSettings.skinVariants),
	onChange: ({value}) => {
		updateAppState((state) => {
			state.userSettings.skinVariants = skinVariantsList[value].toLowerCase();
			state.userSettings.skinVariantsManual = skinVariantsList[value].toLowerCase();
		});
	}
}))(SliderButtonItem);

const DynamicColorSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	selected: userSettings.dynamicColor,
	onToggle: ({selected}) => {
		updateAppState((state) => {
			state.userSettings.dynamicColor = selected;
		});
	}
}))(ColorCheckboxItem);

const ThemeSettingsDecorator = compose(
	AppContextConnect(({userSettings}) => ({
		accent: userSettings.colorAccent,
		highlight: userSettings.colorHighlight,
		skin: userSettings.skin,
		skinVariants: userSettings.skinVariants
	}))
);

const ThemeSettings = ThemeSettingsDecorator(ThemeSettingsBase);

export default ThemeSettings;
