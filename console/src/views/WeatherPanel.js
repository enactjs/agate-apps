import React from 'react';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import {Row, Cell, Column} from '@enact/ui/Layout';
import Heading from '@enact/agate/Heading';
import viewCSS from './WeatherPanel.module.less';
import WeatherItem from '../components/WeatherItem';
import AppStateConnect from '../App/AppContextConnect';

const Weather = kind({
	name: 'Weather',

	styles: {
		css: viewCSS,
		className: 'weatherPanel'
	},

	computed: {
		currentWeather: ({weather}) => {
			const weatherObj = {};
			if (weather.current && weather.current.main) {
				weatherObj.status = weather.current.weather[0].id;
				weatherObj.high = parseInt(weather.current.main.temp);
				weatherObj.low = parseInt(weather.current.main.temp_min);
				weatherObj.description = weather.current.weather[0].description;
				weatherObj.cityName = weather.current.name;
			}

			return weatherObj;
		},
		threeHourlyWeather: ({weather}) => {
			let threeHourly = [];
			if (weather.threeHour && weather.threeHour.list) {
				threeHourly = weather.threeHour.list.slice(0, 3).map(threeHour => {
					const weatherObj = {};

					weatherObj.status = threeHour.weather[0].id;
					weatherObj.high = parseInt(threeHour.main.temp_max);
					weatherObj.low = parseInt(threeHour.main.temp_min);
					weatherObj.description = threeHour.weather[0].description;
					weatherObj.time = new Date(`${threeHour.dt_txt} UTC`);
					weatherObj.time = `${weatherObj.time.getHours() % 12}:00`;

					return weatherObj;
				});
			}

			return threeHourly;
		}
	},

	render: ({css, currentWeather, threeHourlyWeather, ...rest}) => {
		delete rest.weather;
		return (
			<Panel {...rest}>
				<Column align="center center">
					<Cell component={Heading} shrink spacing="large">
						{currentWeather.cityName} Weather
					</Cell>
					<Cell style={{width: '100%'}} shrink>
						<Row className={css.row} align="stretch space-around">
							<Cell>
								<WeatherItem
									featured
									className={css.weatherItem}
									status={currentWeather.status}
									label="Now"
									high={currentWeather.high}
									description={currentWeather.description}
								/>
							</Cell>
							{threeHourlyWeather.map((hours) => {
								return (
									<Cell key={hours.time}>
										<WeatherItem
											status={hours.status}
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
				</Column>
			</Panel>
		);
	}
});

const WeatherDecorator = AppStateConnect(({weather}) => {
	return {
		weather
	};
});

const WeatherPanel = WeatherDecorator(Weather);

export default WeatherPanel;

