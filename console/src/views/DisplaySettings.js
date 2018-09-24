import {adaptEvent, forward, handle} from '@enact/core/handle';
import {Cell, Column} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import Input from '@enact/agate/Input';
import {Panel} from '@enact/agate/Panels'
import React from 'react';
import SliderButton from '@enact/agate/SliderButton';

const DisplaySettings = kind({
	name: 'DisplaySettings',
	handlers: {
		onChange: handle(
			adaptEvent(({value}) => ({fontSize: value}), forward('onUserSettingsChange'))
		)
	},
	render: ({onChange, ...rest}) => {
		return (
			<Panel {...rest}>
				<Column className="enact-fit">
					<Cell shrink>
						<label htmlFor="">Color</label>
						<Input placeholder="Color"/>
					</Cell>
					<Cell shrink>
						<p>Text Size</p>
						<SliderButton onChange={onChange}>{[
							'Small',
							'Medium',
							'Large',
							'Extra Large'
						]}</SliderButton>
					</Cell>
					<Cell shrink>
						<p>Button Shape</p>
						<SliderButton>{[
							'Round',
							'Both',
							'Square'
						]}</SliderButton>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

export default DisplaySettings;