import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import {Row, Cell, Column} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import viewCSS from './WeatherPanel.less';
import WeatherItem from '../components/WeatherItem';

const Weather = kind({
	name: 'Weather',

	styles: {
		css: viewCSS,
		className: 'weatherPanel'
	},
	handlers: {},

	render: ({css, ...rest}) => (
		<Panel {...rest}>
			<Column className="enact-fit" align=" space-evenly">
				<Cell size="5%">
					<Row className={css.row} align="center space-evenly">
						<Divider spacing="small">
							Today
						</Divider>
					</Row>
				</Cell>
				<Cell size="30%">
					<Row className={css.row} align="center space-evenly">
						<Cell size="25%">
							<WeatherItem featured day="Now" high={70} description="sunny" />
						</Cell>
						<Cell size="25%">
							<WeatherItem className={css.weatherItem} day="12:00 PM" high={70} description="sunny" />
						</Cell>
						<Cell size="25%">
							<WeatherItem className={css.weatherItem} day="3:00 PM" high={70} description="sunny" />
						</Cell>
						<Cell size="25%">
							<WeatherItem className={css.weatherItem} day="6:00 PM" high={70} description="sunny" />
						</Cell>
					</Row>
				</Cell>
				<Cell size="5%">
					<Row className={css.row} align="center space-evenly">
						<Divider spacing="small">
							4-Day
						</Divider>
					</Row>
				</Cell>
				<Cell size="30%">
					<Row className={css.row} align="center space-evenly">
						<Cell size="25%">
							<WeatherItem day="Mon" high={70} low={59} description="sunny" />
						</Cell>
						<Cell size="25%">
							<WeatherItem className={css.weatherItem} day="Tue" high={70} low={59} description="sunny" />
						</Cell>
						<Cell size="25%">
							<WeatherItem className={css.weatherItem} day="Wed" high={70} low={59} description="sunny" />
						</Cell>
						<Cell size="25%">
							<WeatherItem className={css.weatherItem} day="Thu" high={70} low={59} description="sunny" />
						</Cell>
					</Row>
				</Cell>
			</Column>
		</Panel>
	)
});

export default Weather;
