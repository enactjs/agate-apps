import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import WeatherItem from '../WeatherItem';
import AppStateConnect from '../../App/AppContextConnect';

import css from './CompactWeather.less';

const CompactWeatherBase = kind({
	name: 'CompactWeather',

	propTypes: {
		cityName: PropTypes.string,
		description: PropTypes.string,
		high: PropTypes.number
	},

	styles: {
		css,
		className: 'compactWeather'
	},

	computed: {
		high: ({high}) => parseInt(high)
	},

	render: ({cityName, high, description, ...rest}) => {
		return (
			<div {...rest}>
				<Row align=" center">
					<Cell shrink>{cityName}</Cell>
				</Row>
				<WeatherItem featured label="Current" high={high} description={description} />
			</div>
		);
	}
});

const CompactWeather = AppStateConnect(({weather}) => {
	const weatherObj = {};
	if (weather.current && weather.current.main) {
		weatherObj.high = weather.current.main.temp;
		weatherObj.description = weather.current.weather[0].description;
		weatherObj.cityName = weather.current.name;
	}
	return {...weatherObj};
})(CompactWeatherBase);

export default CompactWeather;