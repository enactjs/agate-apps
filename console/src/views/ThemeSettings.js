/* eslint-disable react/jsx-no-bind */

import ColorPicker from '@enact/agate/ColorPicker';
import Heading from '@enact/agate/Heading';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import {Panel} from '@enact/agate/Panels';
import SliderButton from '@enact/agate/SliderButton';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useContext, useEffect} from 'react';

import {getPanelIndexOf} from '../App';
import AppContextConnect from '../App/AppContextConnect';
import {AppContext} from "../App/AppContextProvider";

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

let indexAccent = 0;
let indexHighlight = 1000;

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

const ThemeSettingsBase = (props) => {
	const {onSendSkinSettings, prevIndex, ... rest} = props;
	const context = useContext(AppContext);

	const handleSelect =  (ev, {onSelect}) => {
		onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
	};

	useEffect (() => {
		let changeAccentColor, changeHighlightColor;

		if (context.userSettings.dynamicColor) {
			changeAccentColor = setInterval(function () {
				document.body.style.backgroundColor = 'hsl(' + indexAccent + ', 100%, 50%)';
				let RGBColors = document.body.style.backgroundColor.match(/\d+/g);

				const [r, g, b] = RGBColors;
				const HEXColor =  '#' + ((1 << 24) + (Number(r) << 16) + (Number(g) << 8) + Number(b)).toString(16).slice(1);

				context.updateAppState((state) => {
					state.userSettings.colorAccent = HEXColor;
				});

				indexAccent++;
			}, 100);

			changeHighlightColor = setInterval(function () {
				document.body.style.backgroundColor = 'hsl(' + indexHighlight + ', 100%, 50%)';
				let RGBColors = document.body.style.backgroundColor.match(/\d+/g);

				const [r, g, b] = RGBColors;
				const HEXColor =  '#' + ((1 << 24) + (Number(r) << 16) + (Number(g) << 8) + Number(b)).toString(16).slice(1);

				context.updateAppState((state) => {
					state.userSettings.colorHighlight = HEXColor;
				});

				indexHighlight++;
			}, 100);
		}

		return () => {
			clearInterval(changeAccentColor);
			clearInterval(changeHighlightColor);
			indexAccent = 0;
			indexHighlight = 1000;
		};
	}, [context.userSettings.dynamicColor]); // eslint-disable-line react-hooks/exhaustive-deps

	const onChange =  () => {
		props.onSendSkinSettings(props);
	};

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
								<AccentColorSetting label="Accent Color" onClick={onChange} onSendSkinSettings={onSendSkinSettings}>{swatchPalette}</AccentColorSetting>
								<HighlightColorSetting label="Highlight Color" onClick={onChange} onSendSkinSettings={onSendSkinSettings}>{swatchPalette}</HighlightColorSetting>
							</FormRow>
						</Cell>
						<Cell shrink className={componentCss.spacedItem}>
							<SkinSetting label="Skin:" onClick={onChange} onSendSkinSettings={onSendSkinSettings}>
								{skinNames}
							</SkinSetting>
						</Cell>
						<Cell shrink className={componentCss.spacedItem}>
							<SkinVariantsSetting label="Variant:" onClick={onChange} onSendSkinSettings={onSendSkinSettings}>
								{skinVariantsNames}
							</SkinVariantsSetting>
						</Cell>
						{/* <Cell shrink>
							<FontSizeSetting label="Text Size:">
								{['S', 'M', 'L', 'XL']}
							</FontSizeSetting>
						</Cell>*/}
						<Cell shrink className={componentCss.spacedItem}>
							<DynamicColorSetting
								label="Dynamic color change"
								onSendSkinSettings={onSendSkinSettings}
							>
								{['false', 'true']}
							</DynamicColorSetting>
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

const DynamicColorSetting = AppContextConnect(({userSettings, updateAppState}) => ({
	value: userSettings.dynamicColor,
	onChange: ({value}) => {
		updateAppState((state) => {
			state.userSettings.dynamicColor = value;
		});
	}
}))(SliderButtonItem);

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
		});
	}
}))(SliderButtonItem);

const ThemeSettingsDecorator = compose(
	AppContextConnect(({userSettings}) => ({
		accent: userSettings.colorAccent,
		dynamicColor: userSettings.dynamicColor,
		highlight: userSettings.colorHighlight,
		skin: userSettings.skin,
		skinVariants: userSettings.skinVariants
	}))
);

const ThemeSettings = ThemeSettingsDecorator(ThemeSettingsBase);

export default ThemeSettings;
