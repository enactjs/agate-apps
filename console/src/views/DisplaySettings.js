import React, {Component} from 'react';
import {Panel} from '@enact/agate/Panels'
import {Cell, Column, Row} from '@enact/ui/Layout';
import Input from '@enact/agate/Input';
import SliderButton from '@enact/agate/SliderButton';
import {AppContext} from '../App/App'

class DisplaySettings extends Component {
	constructor(props){
		super(props)
	}

	changeFontSize = (update) => ({value}) =>{
		update((draft) => {
			draft.userSettings.fontSize = value;
		});
	}

	render() {
		return (
			<Panel {...this.props}>
				<AppContext.Consumer>
					{({updateAppState, userSettings}) => (
						<Column className="enact-fit">
							<label htmlFor="">Color</label>
							<Input placeholder="Color"/>
							<p>Text Size</p>
							{userSettings.fontSize}
							<SliderButton
								onChange={this.changeFontSize(updateAppState)}
								value={userSettings.fontSize}
							>{[
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
						)}
				</AppContext.Consumer>
			</Panel>
		);
	}
}

export default DisplaySettings;