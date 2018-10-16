import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

import MapCore from '../components/MapCore';

// import css from './Map.less';

const MapViewBase = kind({
	name: 'MapView',

	// styles: {
	// 	css,
	// 	className: 'map'
	// },

	render: ({...rest}) => {
		return (
			<Panel {...rest}>
				<MapCore />
			</Panel>
		);
	}
});

export default MapViewBase;
