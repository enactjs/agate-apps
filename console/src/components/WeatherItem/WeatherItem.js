import React from 'react';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';

import css from './WeatherItem.less';
import SunIcon from './icons/wi-day-sunny.svg';
import Skinnable from '@enact/agate/Skinnable';

const WeatherItemBase = kind({
	name: 'WeatherItem',

	styles: {
		css,
		className: 'weatherItem'
	},
	handlers: {},
	computed: {
		className: ({featured, styler}) => styler.append(featured ? css.featured : '')
	},

	render: ({label, description, high, low, featured, ...rest}) => (
		<Column {...rest} align="center">
			<Cell className={css.item} shrink>
				<Row align=" center" className={`${css.text} ${css.header}`}>
					<Cell size={'100%'}>
						{label}
					</Cell>
				</Row>
			</Cell>
			<Cell className={css.item} shrink>
				<img className={css.icon} src={SunIcon} alt="" />
			</Cell>
			<Cell className={css.item} shrink>
				<div className={css.text}>{description}</div>
			</Cell>
			<Cell className={css.item} shrink>
				<Row>
					<Cell size={'100%'} className={css.text}>
						{high}°
					</Cell>
				</Row>
			</Cell>
			{low ?
				<Cell className={css.item} shrink>
					<Row>
						<Cell size={'100%'} className={css.text}>
							{low}°
						</Cell>
					</Row>
				</Cell> :
				null
			}
		</Column>
	)
});

const WeatherItemDecorator = Skinnable;

const WeatherItem = WeatherItemDecorator(WeatherItemBase);

export default WeatherItem;
