import kind from '@enact/core/kind';
import Skinnable from '@enact/agate/Skinnable';
import React from 'react';
import PropTypes from 'prop-types';

import MapController from '../MapController';
import Widget from '../Widget';

import css from './CompactMap.less';

const CompactMapBase = kind({
	name: 'CompactMap',

	propTypes: {
		follow: PropTypes.bool
	},

	styles: {
		css,
		className: 'compactMap'
	},

	render: ({follow, ...rest}) => {
		return (
			<Widget {...rest} title="Map" description="Choose a destination and navigate" noHeader>
				<small>
					<MapController
						controlScheme="compact"
						follow={follow}
					/>
				</small>
				<large>
					<MapController
						controlScheme="compact"
						locationSelection
						autonomousSelection
						follow={follow}
					>
						{/* <tools>
							<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
							<Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
							<Button alt="Navigate Here" icon="play" onClick={onSetDestination} />
						</tools>*/}
					</MapController>
				</large>
			</Widget>
		);
	}
});

const CompactMap = Skinnable(CompactMapBase);

export default CompactMap;
