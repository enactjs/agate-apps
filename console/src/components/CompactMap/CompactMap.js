import Skinnable from '@enact/agate/Skinnable';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import GoogleMaps from '../GoogleMaps';
import MapController from '../MapController';
import Widget from '../Widget';

import css from './CompactMap.module.less';

const CompactMapBase = kind({
	name: 'CompactMap',

	propTypes: {
		follow: PropTypes.bool,
		mapsLibrary: PropTypes.number,
		onExpand: PropTypes.func
	},

	styles: {
		css,
		className: 'compactMap'
	},

	render: ({follow, mapsLibrary, onExpand, ...rest}) => {
		return (
			<Widget {...rest} icon="compass" title="Map" description="Choose a destination and navigate" noHeader>
				<small>
					{mapsLibrary === 0 ?
						<GoogleMaps onExpand={onExpand} /> :
						<MapController
							controlScheme="compact"
							follow={follow}
							onExpand={onExpand}
						/>
					}
				</small>
				<large>
					{mapsLibrary === 0 ?
						<GoogleMaps onExpand={onExpand} /> :
						<MapController
							controlScheme="compact"
							locationSelection
							autonomousSelection
							follow={follow}
							onExpand={onExpand}
						>
							{/* <tools>
							<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
							<Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
							<Button alt="Navigate Here" icon="play" onClick={onSetDestination} />
						</tools>*/}
						</MapController>
					}
				</large>
			</Widget>
		);
	}
});

const CompactMap = Skinnable(CompactMapBase);

export default CompactMap;
