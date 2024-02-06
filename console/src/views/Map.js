// import Button from '@enact/agate/Button';
import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import GoogleMaps from '../components/GoogleMaps';
import MapController from '../components/MapController';

import css from './Map.module.less';

const MapViewBase = kind({
	name: 'MapView',

	propTypes: {
		loadGoogleMaps: PropTypes.bool,
		mapsLibrary: PropTypes.number
	},

	styles: {
		css,
		className: 'map'
	},

	render: ({loadGoogleMaps, mapsLibrary, ...rest}) => {
		return (
			<Panel {...rest}>
				{mapsLibrary === 0 ?
					loadGoogleMaps ? <GoogleMaps noExpandButton /> : <></> :
					<MapController autonomousSelection locationSelection noExpandButton>
						{/* <tools>
						<Button alt="POI search" icon="search" />
						<Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
						<Button alt="Navigate here" icon="play" onClick={onSetDestination} />
					</tools>*/}
					</MapController>
				}
			</Panel>
		);
	}
});

export default MapViewBase;
export {
	MapViewBase as MapView,
	MapViewBase
};
