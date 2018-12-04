import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

import MapController from '../components/MapController';

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
				<MapController selfDrivingSelection locationSelection />
			</Panel>
		);
	}
});

export default MapViewBase;
