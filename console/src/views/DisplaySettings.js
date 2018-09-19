import React, { Component } from 'react';
import {Panel} from '@enact/agate/Panels'
import {Cell, Column, Row} from '@enact/ui/Layout';
import Input from '@enact/agate/Input';
import SliderButton from '@enact/agate/SliderButton';

class DisplaySettings extends Component {

	render() {
		return (
			<Panel {...this.props}>
				<Column className="enact-fit">
					<label htmlFor="">Color</label>
					<Input placeholder="Color"/>
					<p>Text Size</p>
					<SliderButton onChange={({value}) => this.props.onUserSettingsChange({fontSize: value})}>{[
						'Small',
						'Medium',
						'Large',
						'Extra Large'
					]}</SliderButton>
					<p>Button Shape</p>
					<SliderButton>{[
						'Round',
						'Both',
						'Square'
					]}</SliderButton>
				</Column>
			</Panel>
		);
	}
}

export default DisplaySettings;