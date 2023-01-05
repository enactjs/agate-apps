import {ResponsiveBox} from '@enact/agate/DropManager';
import Heading from '@enact/agate/Heading';
import Icon from '@enact/agate/Icon';
import Item from '@enact/agate/Item';
import {Panel} from '@enact/agate/Panels';
import ProgressBar from '@enact/agate/ProgressBar';
import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';
import Layout, {Cell, Column, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';

import CarPng from '../../assets/car.png';
import AppContextConnect from '../App/AppContextConnect';
import CustomLayout, {SaveLayoutArrangement} from '../components/CustomLayout';

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

	propTypes: {
		arrangeable: PropTypes.bool,
		arrangement: PropTypes.string,
		linearVelocity: PropTypes.number,
		onArrange: PropTypes.func
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
							<Cell shrink className={css.mph}>
								mph
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
									<Item label="23.1 psi" spotlightDisabled>
										<Icon slot="slotBefore">compass</Icon>
										Tire psi
									</Item>
								</Cell>
								<Cell component={Heading} shrink showLine />
								<Cell shrink>
									<Item label="23.1 psi" spotlightDisabled>
										<Icon slot="slotBefore">compass</Icon>
										Tire psi
									</Item>
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
									<Item label="23.1 psi" spotlightDisabled>
										<Icon slot="slotBefore">compass</Icon>
										Tire psi
									</Item>
								</Cell>
								<Cell component={Heading} shrink showLine />
								<Cell shrink>
									<Item label="23.1 psi" spotlightDisabled>
										<Icon slot="slotBefore">compass</Icon>
										Tire psi
									</Item>
								</Cell>
							</Column>
						</Cell>
					</Row>

					<bottomLeft>
						<ResponsiveLayout style={{height: '100%'}}>
							<Cell>
								<Item label="temp" spotlightDisabled>
									<Icon slot="slotBefore">temperature</Icon>
									<ProgressBar className={css.progressBar} progress={0.25} />
								</Item>
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
								<Item label="fuel" spotlightDisabled>
									<Icon slot="slotBefore">setting</Icon>
									<ProgressBar className={css.progressBar} progress={0.75} />
								</Item>
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
