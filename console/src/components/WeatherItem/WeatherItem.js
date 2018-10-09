import React from 'react';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';

import css from './WeatherItem.less';
import SunIcon from './icons/wi-day-sunny.svg';

const WeatherItem = kind({
	name: 'WeatherItem',

	styles: {
		css,
		className: 'weatherItem'
	},
	handlers: {},
	computed: {
		className: ({featured, styler}) => styler.append(featured ? css.featured : '')
	},


	render: ({day, high, low, featured, ...rest}) => (
		<Column {...rest} align="center center">
			<Cell className={css.item} size={'20%'}>
				<Row align=" center" className={css.text}>
					<Cell size={'100%'}>
						{day}
					</Cell>
				</Row>
			</Cell>
			<Cell className={css.item} size={'20%'}>
				<img className={css.icon} src={SunIcon} alt="" />
			</Cell>
			<Cell className={css.item} size={'20%'}>
				<Row>
					<Cell size={'100%'} className={css.text}>
						{high}°
					</Cell>
				</Row>
			</Cell>
			{low ?
				<Cell className={css.item} size={'20%'}>
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

export default WeatherItem;
