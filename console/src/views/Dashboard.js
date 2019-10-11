import Divider from '@enact/agate/Divider';
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
		sendTelemetry: PropTypes.func,
		linearVelocity: PropTypes.number
	},

	styles: {
		css,
		className: 'dashboard'
	},

	computed: {
		speed: ({linearVelocity}) => Math.round(linearVelocity * 2.237) // meters per second to miles per hour. Multiply by the constant: 2.237
	},

	handlers: {
		onClick: (ev, {sendTelemetry}) => {
			const time = new Date();
			time.setSeconds(time.getSeconds() - 1);
			sendTelemetry({
				appInstanceId: 'hvac',
				appName: 'hvac',
				featureName: 'Windshield setting change',
				status: 'Running',
				appStartTime: time,
				intervalFlag: false
			});
		}
	},

	render: ({arrangeable, arrangement, onArrange, onClick, speed, ...rest}) => {
		delete rest.linearVelocity;
		delete rest.sendTelemetry;
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
								<Cell shrink><img className={css.carImage} src={CarPng} alt="" /></Cell>
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
								<IconItem icon="temperature" label="temp" spotlightDisabled>
									<ProgressBar className={css.progressBar} progress={0.25} />
								</IconItem>
							</Cell>
						</ResponsiveLayout>
					</bottomLeft>

					<bottom>
						<ResponsiveLayout wrap>
							<Cell component={ToggleButton} onClick={onClick} className={css.spacedToggles} shrink icon="defrosterback" />
							<Cell component={ToggleButton} onClick={onClick} className={css.spacedToggles} shrink icon="defrosterfront" />
						</ResponsiveLayout>
					</bottom>

					<bottomRight>
						<ResponsiveLayout style={{height: '100%'}}>
							<Cell>
								<IconItem icon="setting" label="fuel" spotlightDisabled>
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

const ConnectedDashboard = AppContextConnect(({location, sendTelemetry}) => ({
	linearVelocity: location.linearVelocity,
	sendTelemetry
}));

const Dashboard = ConnectedDashboard(SaveLayoutArrangement('dashboard')(DashboardBase));

export default Dashboard;
export {
	Dashboard,
	DashboardBase
};
