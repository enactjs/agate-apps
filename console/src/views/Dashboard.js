import Divider from '@enact/agate/Divider';
import Item from '@enact/agate/Item';
import IconItem from '@enact/agate/IconItem';
import {Panel} from '@enact/agate/Panels';
import ProgressBar from '@enact/agate/ProgressBar';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import Layout, {Cell, Column, Row} from '@enact/ui/Layout';
import React from 'react';

import CustomLayout from '../components/CustomLayout';
import CarSvg from '../components/Dashboard/svg/car.svg';

import css from './Dashboard.less';


const Dashboard = kind({
	name: 'Dashboard',

	styles: {
		css,
		className: 'dashboard'
	},

	render: (props) => (
		<Panel {...props}>
			<CustomLayout>
				<top>
					<Row align="center space-around">
						<Column className={css.sideInfo} align="center space-between">
							<Divider startSection>
								<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
							</Divider>
							<Divider startSection>
								<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
							</Divider>
						</Column>
						<Column>
							<Layout align="center center" wrap>
								<Row style={{fontSize: '72px'}}>
									87
								</Row>
								<Row>
									<Item spotlightDisabled inline>mph</Item>
								</Row>
							</Layout>
							<Layout align="center space-around" wrap>
								<Item spotlightDisabled inline>912,837 miles</Item>
							</Layout>
							<img className={css.svg} src={CarSvg} alt="" />
						</Column>
						<Column className={css.sideInfo} align="center space-between">
							<Divider startSection>
								<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
							</Divider>
							<Divider startSection>
								<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
							</Divider>
						</Column>
					</Row>
				</top>
				<bottom>
					<Row align="center space-between" wrap>
						<IconItem icon="gear" label="temp" inline spotlightDisabled>
							<ProgressBar className={css.progressBar} progress={0.25} />
						</IconItem>
						<IconItem icon="plug" label="fuel" inline spotlightDisabled>
							<ProgressBar className={css.progressBar} progress={0.75} />
						</IconItem>
					</Row>
					<Row align="center space-around" wrap>
						<Cell component={ToggleButton} className={css.spacedToggles} shrink underline icon="airdown" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink underline icon="airup" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink underline icon="airright" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink underline icon="defrosterback" />
						<Cell component={ToggleButton} className={css.spacedToggles} shrink underline icon="defrosterfront" />
					</Row>
				</bottom>
			</CustomLayout>
		</Panel>
	)
});

export default Dashboard;
export {
	Dashboard as App,
	Dashboard
};
