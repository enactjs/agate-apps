import Button                from '@enact/agate/Button';
import Divider               from '@enact/agate/Divider';
import LabeledIconButton     from '@enact/agate/LabeledIconButton';
import {Panel}               from '@enact/agate/Panels';
import SliderButton          from '@enact/agate/SliderButton';
import kind                  from '@enact/core/kind';
import {Row, Cell}           from '@enact/ui/Layout';
import React                 from 'react';

import css                   from './HVAC.less';

const Hvac = kind({
	name: 'HVAC',

	styles: {
		css,
		className: 'hvac'
	},

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
				<LabeledIconButton icon="arrowsmalldown">Down</LabeledIconButton>
				<LabeledIconButton icon="arrowsmallup">Up</LabeledIconButton>
				<LabeledIconButton icon="arrowsmallright">Face</LabeledIconButton>
				<LabeledIconButton icon="hollowstar">Rear</LabeledIconButton>
				<LabeledIconButton icon="hollowstar">Front</LabeledIconButton>
			</Row>
		</Panel>
	)
});

export default Hvac;
export {
	Hvac as App,
	Hvac
};
