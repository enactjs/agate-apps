import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import {Row, Cell, Column} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import viewCSS from './WeatherPanel.less';
import WeatherItem from '../components/WeatherItem';
import AppStateConnect from '../App/AppContextConnect';

const Weather = kind({
	name: 'Weather',

	styles: {
		css: viewCSS,
		className: 'weatherPanel'
	},
	handlers: {},

	computed: {
		currentWeather: ({weather}) => {
			const weatherObj = {};
			if (weather.current) {
				weatherObj.high = parseInt(weather.current.main.temp_max);
				weatherObj.low = parseInt(weather.current.main.temp_min);
				weatherObj.description = weather.current.weather[0].description;
			}

			return weatherObj;
		},
		hourlyWeather: ({weather}) => {
			let hourly = [];
			for (let index = 0; index < 3; index++) {
				const weatherObj = {};
				if (weather.hours) {
					const hour = weather.hours.list[index];

					weatherObj.high = parseInt(hour.main.temp_max);
					weatherObj.low = parseInt(hour.main.temp_min);
					weatherObj.description = hour.weather[0].description;
					weatherObj.time = new Date(`${hour.dt_txt} UTC`);
					weatherObj.time = `${weatherObj.time.getHours() % 12}:00`;

					hourly.push(weatherObj);
				}

			}

			return hourly;
		}
	},

	render: ({css, weather, currentWeather, hourlyWeather, ...rest}) => {
		return (
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
								<WeatherItem featured className={css.weatherItem} label="Now" high={currentWeather.high} description="sunny" />
							</Cell>
							{hourlyWeather.map((hours) => {
								return (
									<Cell key={hours.time} size="25%">
										<WeatherItem
											className={css.weatherItem}
											label={hours.time}
											high={hours.high}
											description={hours.description}
										/>
									</Cell>
								);
							})}
						</Row>
					</Cell>
					<Cell size="5%">
						<Row className={css.row} align="center space-evenly">
							<Divider spacing="small">
							4-Day
							</Divider>
						</Row>
					</Cell>
					{/*Did not connect these parts. This is more to show layout. We may need to switch api for daily weather.*/ }
					<Cell size="30%">
						<Row className={css.row} align="center space-evenly">
							<Cell size="25%">
								<WeatherItem className={css.weatherItem} label="Mon" high={70} low={59} description="sunny" />
							</Cell>
							<Cell size="25%">
								<WeatherItem className={css.weatherItem} label="Tue" high={70} low={59} description="sunny" />
							</Cell>
							<Cell size="25%">
								<WeatherItem className={css.weatherItem} label="Wed" high={70} low={59} description="sunny" />
							</Cell>
							<Cell size="25%">
								<WeatherItem className={css.weatherItem} label="Thu" high={70} low={59} description="sunny" />
							</Cell>
						</Row>
					</Cell>
				</Column>
			</Panel>
		)
		;
	}
});

const WeatherDecorator = AppStateConnect(({weather}) => {
	return {
		weather
	};
});

const WeatherPanel = WeatherDecorator(Weather);

export default WeatherPanel;

