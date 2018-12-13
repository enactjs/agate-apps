// import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

import MapController from '../components/MapController';

import css from './Map.less';

const MapViewBase = kind({
	name: 'MapView',

	styles: {
		css,
		className: 'map'
	},

	render: ({...rest}) => {
		return (
			<Panel {...rest}>
				<MapController autonomousSelection locationSelection>
					{/* <tools>
						<Button alt="POI search" icon="search" />
						<Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
						<Button alt="Navigate here" icon="play" onClick={onSetDestination} />
					</tools>*/}
				</MapController>
			</Panel>
		);
	}
});

export default MapViewBase;
export {
	MapViewBase as MapView,
	MapViewBase
};
