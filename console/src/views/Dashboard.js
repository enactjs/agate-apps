import Divider from '@enact/agate/Divider';
import Image from '@enact/agate/Image';
import Item from '@enact/agate/Item';
import IconItem from '@enact/agate/IconItem';
import {ResponsiveBox} from '@enact/agate/DropManager';
import {Panel} from '@enact/agate/Panels';
import ProgressBar from '@enact/agate/ProgressBar';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import Layout, {Cell, Column, Row} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';

import AppContextConnect from '../App/AppContextConnect';
import CustomLayout, {SaveLayoutArrangement} from '../components/CustomLayout';
import CarPng from '../../assets/car.png';

import css from './Dashboard.module.less';

const ResponsiveLayout = ResponsiveBox(({containerShape, ...rest}) => {
	const orientation = (containerShape.orientation === 'portrait') ? 'vertical' : 'horizontal';
	const {right, left} = containerShape.edges;
	let axisAlign = 'center';
	if (left) axisAlign = 'start';
	else if (right) axisAlign = 'end';

	return (
		<Layout align={'center ' + axisAlign} orientation={orientation} {...rest} />
	);
});


const DashboardBase = kind({
	name: 'Dashboard',

	proptypes: {
		linearVelocity: PropTypes.number
	},

	styles: {
		css,
		className: 'dashboard'
	},

	computed: {
		speed: ({linearVelocity}) => Math.round(linearVelocity * 2.237) // meters per second to miles per hour. Multiply by the constant: 2.237
	},

	render: ({arrangeable, arrangement, onArrange, speed, ...rest}) => {
		delete rest.linearVelocity;
		return (
			<Panel {...rest}>
				<CustomLayout arrangeable={arrangeable} arrangement={arrangement} onArrange={onArrange}>
					<top>
						<Row align="center center" wrap>
							<Cell shrink className={css.speed}>
								{speed}
							</Cell>
							<Cell shrink>
								<Item spotlightDisabled inline>mph</Item>
							</Cell>
						</Row>
						{/*
						// If we get the distance the simulator has driven, wire up this section.
						<Row align="center space-around" wrap>
							<Cell component={Item} spotlightDisabled inline>912,837 miles</Cell>
						</Row>
						*/}
					</top>

					<Row align="center center">
						<Cell size="20%">
							<Column className={css.sideInfo} align="stretch space-between">
								<Cell shrink>
									<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
								</Cell>
								<Cell component={Divider} shrink startSection />
								<Cell shrink>
									<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
								</Cell>
							</Column>
						</Cell>
						<Cell shrink>
							<Column>
								<Cell component={Image} className={css.carImage} shrink src={CarPng} alt="" />
							</Column>
						</Cell>
						<Cell size="20%">
							<Column className={css.sideInfo} align="stretch space-between">
								<Cell shrink>
									<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
								</Cell>
								<Cell component={Divider} shrink startSection />
								<Cell shrink>
									<IconItem icon="compass" label="23.1 psi" spotlightDisabled>Tire psi</IconItem>
								</Cell>
							</Column>
						</Cell>
					</Row>

					<bottomLeft>
						<ResponsiveLayout style={{height: '100%'}}>
							<Cell>
								<IconItem icon="gear" label="temp" spotlightDisabled>
									<ProgressBar className={css.progressBar} progress={0.25} />
								</IconItem>
							</Cell>
						</ResponsiveLayout>
					</bottomLeft>

					<bottom>
						<ResponsiveLayout wrap>
							<Cell component={ToggleButton} className={css.spacedToggles} shrink icon="defrosterback" />
							<Cell component={ToggleButton} className={css.spacedToggles} shrink icon="defrosterfront" />
						</ResponsiveLayout>
					</bottom>

					<bottomRight>
						<ResponsiveLayout style={{height: '100%'}}>
							<Cell>
								<IconItem icon="plug" label="fuel" spotlightDisabled>
									<ProgressBar className={css.progressBar} progress={0.75} />
								</IconItem>
							</Cell>
						</ResponsiveLayout>
					</bottomRight>
				</CustomLayout>
			</Panel>
		);
	}
});

const ConnectedDashboard = AppContextConnect(({location}) => ({
	linearVelocity: location.linearVelocity
}));

const Dashboard = ConnectedDashboard(SaveLayoutArrangement('dashboard')(DashboardBase));

export default Dashboard;
export {
	Dashboard,
	DashboardBase
};
