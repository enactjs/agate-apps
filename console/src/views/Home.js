import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import CompactRadio from '../components/CompactRadio';
import CompactHvac from '../components/CompactHVAC';
import CompactAppList from '../components/CompactAppList';

import css from './Home.less';

const Home = kind({
	name: 'Home',

	render: ({onSelect, ...rest}) => {
		return(
			<Panel {...rest}>
				<Column>
					<Cell><Row><Cell><CompactRadio /></Cell><Cell><CompactHvac /></Cell></Row></Cell>
					<Cell>
						<Row>
							<Cell><CompactAppList onSelect={onSelect}/></Cell>
							<Cell className={css.quadFour}>GPS</Cell>
						</Row>
					</Cell>
				</Column>
			</Panel>
		);
	}
});

export default Home;
