import React from 'react';
import kind from '@enact/core/kind';
import {Column, Cell} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import Skinnable from '@enact/agate/Skinnable';

import css from './WeatherItem.less';
import SunIcon from './icons/wi-day-sunny.svg';

const WeatherItemBase = kind({
	name: 'WeatherItem',

	styles: {
		css,
		className: 'weatherItem'
	},

	computed: {
		className: ({featured, styler}) => styler.append({featured})
	},

	render: ({label, description, high, low, ...rest}) => {
		delete rest.featured;

		return (
			<Column {...rest} align="center">
				<Cell className={css.item} component={Divider} shrink>
					{label}
				</Cell>
				<Cell className={css.item} shrink>
					<img className={css.icon} src={SunIcon} alt="" />
				</Cell>
				<Cell className={css.item} shrink>
					{description}
				</Cell>
				<Cell className={css.item} shrink>
					{high}°
				</Cell>
				{low ?
					<Cell className={css.item} shrink>
						{low}°
					</Cell> :
					null
				}
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
