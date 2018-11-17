import kind from '@enact/core/kind';
import GridListImageItem from '@enact/agate/GridListImageItem';
import Layout from '@enact/ui/Layout';
import React from 'react';

import css from './CompactRadio.less';

const placeholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

const CompactRadioBase = kind({
	name: 'CompactRadio',

	styles: {
		css,
		className: 'compactRadio'
	},

	render: ({...rest}) => {
		return (
			<Layout {...rest} align="center center">
				<GridListImageItem
					caption="The Song"
					className={css.album}
					placeholder={placeholder}
					src={placeholder}
					subCaption="The Album by The Artist"
				/>
			</Layout>
		);
	}
});

export default CompactRadioBase;
export {
	CompactRadioBase as CompactRadio,
	CompactRadioBase
};
