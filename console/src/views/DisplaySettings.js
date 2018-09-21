import React, { Component } from 'react';
import {Panel} from '@enact/agate/Panels'
import {Cell, Column, Row} from '@enact/ui/Layout';
import Input from '@enact/agate/Input';
import SliderButton from '@enact/agate/SliderButton';
import {inject, Observer, observer} from "mobx-react";

class DisplaySettings extends Component {


	render() {
		console.log('re-render', this.props.userSettings)

		return (
			<Panel {...this.props}>
				<Column className="enact-fit">
					<label htmlFor="">Color</label>
					<Input placeholder="Color"/>
					<p>Text Size</p>
					<div>{this.props.userSettings.fontSize}</div>
					<SliderButton onChange={({value}) => this.props.userSettings.setFontSize(value)}>{[
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

const DisplaySettingsObserver = inject("userSettings")(observer(DisplaySettings));

export default DisplaySettingsObserver;