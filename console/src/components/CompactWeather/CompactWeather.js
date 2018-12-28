import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Cell} from '@enact/ui/Layout';

import Widget from '../Widget';
import WeatherItem from '../WeatherItem';
import AppStateConnect from '../../App/AppContextConnect';

import css from './CompactWeather.less';

const CompactWeatherBase = kind({
	name: 'CompactWeather',

	propTypes: {
		cityName: PropTypes.string,
		description: PropTypes.string,
		status: PropTypes.number,
		temp: PropTypes.number
	},

	styles: {
		css,
		className: 'compactWeather'
	},

	computed: {
		temp: ({temp}) => parseInt(temp)
	},

	render: ({status, temp, ...rest}) => {
		return (
			<Widget {...rest} icon="climate" title="Current Weather" description="Local weather information" view="weather">
				<Cell>
					<WeatherItem featured status={status} high={temp} />
				</Cell>
			</Widget>
		);
	}
});


const CompactWeather = AppStateConnect(({weather}) => {
	const weatherObj = {};
	if (weather.current && weather.current.main) {
		weatherObj.status = weather.current.weather[0].id;
		weatherObj.temp = weather.current.main.temp;
	}
	return {...weatherObj};
})(CompactWeatherBase);

export default CompactWeather;
