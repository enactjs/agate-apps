import Button from '@enact/agate/Button';
import ColorPicker from '@enact/agate/ColorPicker';
import DateTimePicker from '@enact/agate/DateTimePicker';
import Divider from '@enact/agate/Divider'
import IconButton from '@enact/agate/IconButton';
import IconItem from '@enact/agate/IconItem';
import IncrementSlider from '@enact/agate/IncrementSlider';
import Input from '@enact/agate/Input';
import Item from '@enact/agate/Item';
import LabeledIcon from '@enact/agate/LabeledIcon';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import LabeledItem from '@enact/agate/LabeledItem';
import Picker from '@enact/agate/Picker';
import ProgressBar from '@enact/agate/ProgressBar';
import RadioItem from '@enact/agate/RadioItem';
import Slider from '@enact/agate/Slider';
import SliderButton from '@enact/agate/SliderButton';
import SwitchItem from '@enact/agate/SwitchItem';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import {Panel} from '@enact/moonstone/Panels';
import React from 'react';

const style = {
	colorPickerContainer: {
		display: 'inline-block',
		position: 'relative',
		width: '400px'
	},
	flexBox: {
		display: 'flex'
	},
	flexItem: {
		flex: '1'
	}
};

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Divider spacing="normal" startSection>
				Agate kitchen sink
			</Divider>
			<Button>Click me</Button>
			<IconButton type="standard">home</IconButton>
			<ToggleButton underline type="standard" toggleOffLabel="Off" toggleOnLabel="On" />
			<Input placeholder="Input text here" />
			<LabeledIcon inline icon="temperature">Hello LabeledIcon</LabeledIcon>
			<LabeledIconButton inline icon="compass">Hello LabeledIconButton</LabeledIconButton>
			<div style={style.colorPickerContainer}>
				<ColorPicker direction="right" defaultValue="#3467af">
					{['green',
					'yellow',
					'orange',
					'red',
					'black',
					'gray',
					'white',
					'maroon']}
				</ColorPicker>
			</div>
			<div style={style.flexBox}>
				<div style={style.flexItem}>
					<RadioItem icon="music">
						Sound
					</RadioItem>
					<Slider
						max={100}
						min={0}
						orientation="horizontal"
						step={1}
					/>
					<IncrementSlider
						decrementIcon="minus"
						incrementIcon="plus"
						max={100}
						min={0}
						orientation="horizontal"
						step={1}
					/>
				</div>
				<div style={style.flexItem}>
					<DateTimePicker />
				</div>
			</div>
			<div style={style.flexBox}>
				<Divider style={style.flexItem}>
					<IconItem label="Label" icon="compass">
						Hello IconItem
					</IconItem>
					<Item>
						Hello Item
					</Item>
					<SwitchItem defaultSelected icon="music">
						Sound
					</SwitchItem>
					<SliderButton>
						{['Light',
						'Medium',
						'Dark']}
					</SliderButton>
				</Divider>
				<Divider style={style.flexItem}>
					<LabeledItem label="Label" titleIcon="expand">
						Hello LabeledItem
					</LabeledItem>
					<Picker>{['LO', 'MD' , 'HI']}</Picker>
				</Divider>
			</div>
			<Divider>
				<ProgressBar
					rientation="horizontal"
					progress={0.4}
				/>
			</Divider>
		</Panel>
	)
});

export default MainPanel;
