import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels'
import ColorPicker from '@enact/agate/ColorPicker';
import {Row, Column, Cell} from '@enact/ui/Layout';
import SliderButton from '@enact/agate/SliderButton';
import Divider from '@enact/agate/Divider';
import {AppContext} from '../App/App'

import viewCss from './Settings.less';


const DisplaySettings = kind({
	name: 'DisplaySettings',

	styles: {
		css: viewCss,
		className: 'settingsView'
	},

	handlers: {
		changeFontSize: (update) => ({value}) =>{
			update((draft) => {
				draft.userSettings.fontSize = value;
			});
		},
		changeColor: (update) => ({value}) =>{
			update((draft) => {
				draft.userSettings.color = value;
			});
		}
	},
	render: ({css, changeColor, changeFontSize, ...rest}) => (
		<Panel {...rest}>
			<AppContext.Consumer>
				{({updateAppState, userSettings}) => (
					<Row className="enact-fit">
						<Cell />
						<Cell
							className={css.content}
							component={Column}
						>
							<Cell />
							<Cell
								className={css.header}
								component={Divider}
								shrink
								spacing="small"
							>
								Display Settings
							</Cell>
							<Cell>
								<p>Color:</p>
								<ColorPicker defaultValue={userSettings.color} onChange={changeColor(updateAppState)} />
							</Cell>
							<Cell>
								<p>Text Size:</p>
								<SliderButton
									onChange={changeFontSize(updateAppState)}
									value={userSettings.fontSize}
								>
									{['S', 'M', 'L', 'XL']}
								</SliderButton>
							</Cell>
							<Cell />
						</Cell>
						<Cell />
					</Row>
				)}
			</AppContext.Consumer>
		</Panel>
	)
})

export default DisplaySettings;
