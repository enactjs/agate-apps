import {Row, Cell} from '@enact/ui/Layout';
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

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Divider spacing="normal" startSection>
				Agate kitchen sink
			</Divider>
			<Row align="center space-around">
				<Cell shrink>
					<Button>Click me</Button>
					<IconButton type="standard">home</IconButton>
					<ToggleButton underline type="standard" toggleOffLabel="Off" toggleOnLabel="On" />
				</Cell>
				<Cell shrink>
					<Input placeholder="Input text here" />
				</Cell>
				<Cell shrink>
					<ColorPicker direction="right" value="#3467af">
						{['green',
						'yellow',
						'orange',
						'red',
						'black',
						'gray',
						'white',
						'maroon']}
					</ColorPicker>
				</Cell>
				<Cell shrink>
					<LabeledIcon inline icon="temperature">Hello LabeledIcon</LabeledIcon>
					<LabeledIconButton inline icon="compass">Hello LabeledIconButton</LabeledIconButton>
				</Cell>
			</Row>
			<Row>
				<Cell>
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
					<SliderButton>
						{['Light',
						'Medium',
						'Dark']}
					</SliderButton>
				</Cell>
				<Cell>
					<Picker>{['LO', 'MD' , 'HI']}</Picker>
				</Cell>
			</Row>
			<Row>
				<Cell>
					<Item>
						Hello Item
					</Item>
					<LabeledItem label="Label" titleIcon="expand">
						Hello LabeledItem
					</LabeledItem>
					<IconItem label="Label" icon="compass">
						Hello IconItem
					</IconItem>
					<RadioItem icon="music">
						Sound
					</RadioItem>
					<SwitchItem defaultSelected icon="music">
						Sound
					</SwitchItem>
				</Cell>
				<Cell>
					<DateTimePicker />
				</Cell>
			</Row>
			<Divider>ProgressBar</Divider>
			<ProgressBar
				rientation="horizontal"
				progress={0.4}
			/>
		</Panel>
	)
});

export default MainPanel;
