import React from 'react';
import kind from '@enact/core/kind';
import {Column, Cell} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import Image from '@enact/agate/Image';
import Skinnable from '@enact/agate/Skinnable';

import cloudy from '../../../assets/weather/cloudy.png';
import overcast from '../../../assets/weather/overcast.png';
import partiallyCloudy from '../../../assets/weather/partiallyCloudy.png';
import rainy from '../../../assets/weather/rainy.png';
import snowy from '../../../assets/weather/snowy.png';
import sunny from '../../../assets/weather/sunny.png';
import thunderstorm from '../../../assets/weather/thunderstorm.png';

import css from './WeatherItem.less';

const WeatherItemBase = kind({
	name: 'WeatherItem',

	styles: {
		css,
		className: 'weatherItem'
	},

	computed: {
		className: ({featured, styler}) => styler.append({featured}),
		src: ({status}) => {
			if (status >= 200 && status < 300) return thunderstorm;
			if (status >= 300 && status < 400) return rainy;
			if (status >= 500 && status < 600) return rainy;
			if (status >= 600 && status < 700) return snowy;

			// fog, mist, etc
			if (status >= 700 && status < 800) return cloudy;

			switch (status) {
				case 800:
					return sunny;
				case 801:
					return partiallyCloudy;
				case 802:
				case 803:
					return overcast;
				case 804:
					return cloudy;
			}

			return null;
		}
	},

	render: ({label, description, high, low, src, ...rest}) => {
		delete rest.featured;
		delete rest.status;

		return (
			<Column {...rest} align="center space-around">
				{label ? (
					<Cell className={css.item} component={Divider} shrink>
						{label}
					</Cell>
				) : null}
				<Cell component={Image} className={css.icon} shrink src={src} sizing="fit" />
				<Cell className={css.item} shrink>
					{description}
				</Cell>
				{high ? (
					<Cell className={css.item} shrink>
						{high}<span className={css.degree}>°F</span>
					</Cell>
				) : null}
				{low ? (
					<Cell className={css.item} shrink>
						{low}<span className={css.degree}>°F</span>
					</Cell>
				) : null}
			</Column>
		);
	}
});

const WeatherItemDecorator = Skinnable;

const WeatherItem = WeatherItemDecorator(WeatherItemBase);

export default WeatherItem;
export {
	WeatherItem,
	WeatherItemBase,
	WeatherItemDecorator
};
