import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';
import DropManager, {Draggable} from '@enact/agate/DropManager';
import Rearrangeable from '@enact/agate/Rearrangeable';

import CompactRadio from '../components/CompactRadio';
import CompactHvac from '../components/CompactHVAC';
import CompactAppList from '../components/CompactAppList';
import CompactWeather from '../components/CompactWeather';

import css from './Home.less';

const allSlotNames = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight', 'topCenter'];

const DroppableCell = Draggable(Cell);

const HomeDefaultLayout = kind({
	name: 'HomeDefaultLayout',

	propTypes: {
		arrangement: PropTypes.object,
		arranging: PropTypes.bool,
		bottomLeft: PropTypes.node,
		bottomRight: PropTypes.node,
		topCenter: PropTypes.node,
		topLeft: PropTypes.node,
		topRight: PropTypes.node
	},

	styles: {
		css,
		className: 'home'
	},

	computed: {
		className: ({arranging, styler}) => styler.append({arranging})
	},

	render: ({arrangement, bottomLeft, bottomRight, topLeft, topRight, topCenter, ...rest}) => {
		return (
			<Column {...rest}>
				<Cell size="40%">
					<Row className={css.row}>
						<DroppableCell size="30%" className={css.topLeft} arrangement={arrangement} name="topLeft">{topLeft}</DroppableCell>
						<DroppableCell className={css.topCenter} arrangement={arrangement} name="topCenter">{topCenter}</DroppableCell>
						<DroppableCell className={css.topRight} arrangement={arrangement} name="topRight">{topRight}</DroppableCell>
					</Row>
				</Cell>
				<Cell>
					<Row className={css.row}>
						<DroppableCell size="30%" className={css.bottomLeft} arrangement={arrangement} name="bottomLeft">{bottomLeft}</DroppableCell>
						<DroppableCell className={css.bottomRight} arrangement={arrangement} name="bottomRight">{bottomRight}</DroppableCell>
					</Row>
				</Cell>
			</Column>
		);
	}
});

const HomeLayout = DropManager(
	Slottable({slots: allSlotNames},
		Rearrangeable({slots: allSlotNames},
			HomeDefaultLayout
		)
	)
);

const Home = kind({
	name: 'Home',

	propTypes: {
		onSelect: PropTypes.func
	},

	styles: {
		css,
		className: 'homePanel'
	},

	render: ({onSelect, ...rest}) => (
		<Panel {...rest}>
			<HomeLayout>
				<topLeft><CompactRadio /></topLeft>
				<topCenter><CompactWeather /></topCenter>
				<topRight><CompactHvac /></topRight>
				<bottomLeft><CompactAppList align="center space-evenly" onSelect={onSelect} /></bottomLeft>
				<bottomRight><div className={css.quadFour}>GPS</div></bottomRight>
			</HomeLayout>
		</Panel>
	)
});

export default Home;
