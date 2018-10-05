import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';

import CompactRadio from '../components/CompactRadio';
import CompactHvac from '../components/CompactHVAC';
import CompactAppList from '../components/CompactAppList';

import css from './Home.less';

const Home = kind({
	name: 'Home',

	propTypes: {
		onSelect: PropTypes.func
	},

	styles: {
		css,
		className: 'home'
	},

	render: ({onSelect, ...rest}) => (
		<Panel {...rest}>
			<Column>
				<Cell>
					<Row className={css.row}>
						<Cell><CompactRadio /></Cell>
						<Cell><CompactHvac /></Cell>
					</Row>
				</Cell>
				<Cell>
					<Row className={css.row}>
						<Cell><CompactAppList align="center space-evenly" onSelect={onSelect} /></Cell>
						<Cell className={css.quadFour}>GPS</Cell>
					</Row>
				</Cell>
			</Column>
		</Panel>
	)
});

export default Home;
