import Button                from '@enact/agate/Button';
import Divider               from '@enact/agate/Divider';
import LabeledIconButton     from '@enact/agate/LabeledIconButton';
import {Panel}               from '@enact/agate/Panels';
import SliderButton          from '@enact/agate/SliderButton';
import kind                  from '@enact/core/kind';
import {Row, Cell}           from '@enact/ui/Layout';
import React                 from 'react';

// import HeatedSeatButton      from '../components/HeatedSeatButton';
// import Temp                  from '../components/Temp';

import css                   from './HVAC.less';

const Hvac = kind({
    name: 'HVAC',

	propTypes: {
		// Define and document properties
	},

	// Define default values for any properties that have them
	// defaultProps: {
	// },

	styles: {
		css,
		className: 'hvac'
	},

	// Add computed property values
	// computed: {
	// },

	render: (props) => (
		<Panel {...props}>
            <Divider>
                Fan Speed
            </Divider>
			<SliderButton>
                {'Off'}
                {'Low'}
                {'Medium'}
                {'High'}
            </SliderButton>
			<Row className={css.above + ' ' + css.spaced}>
				<LabeledIconButton icon="plus">L Seat</LabeledIconButton>
                <Button type="grid" className={css.button}>
                    A/C
                </Button>
				<LabeledIconButton icon="plus">R Seat</LabeledIconButton>
			</Row>
			<Row className={css.below + ' ' + css.spaced}>
				<Cell>
					Picker
				</Cell>
				<div>
					<Button type="grid" className={css.button}>
						AUTO
					</Button>
                    <Button type="grid" icon="rollforward" className={css.button} />
                </div>
				<Cell>
					Picker
				</Cell>
			</Row>
			<Row className={css.spaced}>
				<LabeledIconButton icon="arrowsmalldown">Air Down</LabeledIconButton>
				<LabeledIconButton icon="arrowsmallup">Air Up</LabeledIconButton>
				<LabeledIconButton icon="arrowsmallright">Air Face</LabeledIconButton>
				<LabeledIconButton icon="hollowstar">Rear Defrost</LabeledIconButton>
				<LabeledIconButton icon="hollowstar">Front Defrost</LabeledIconButton>
			</Row>
		</Panel>
	)
});

export default Hvac;
export {
    Hvac as App,
    Hvac
};
