import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import Skinnable from '@enact/agate/Skinnable';
import React from 'react';
import PropTypes from 'prop-types';

import {propTypeLatLonList} from '../../data/proptypes';

import MapCore from '../MapCore';

import css from './CompactMap.less';

const CompactMapBase = kind({
	name: 'CompactMap',

	propTypes: {
		changeFollow: PropTypes.func,
		changePosition: PropTypes.func,
		destination: propTypeLatLonList,
		follow: PropTypes.bool,
		onSelect: PropTypes.func,
		// A local state method to assign the local destination to the destination prop listed above.
		onSetDestination: PropTypes.func,
		proposedDestination: propTypeLatLonList
	},

	styles: {
		css,
		className: 'compactMap'
	},

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: (props) => {
		return (
			<MapCore compact selfDrivingSelection {...props} />
		);
	}
});

const CompactMapBrains = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'CompactMapBrains';
		constructor (props) {
			super(props);
			this.state = {
				positionIndex: 0,
				destination: null
			};
		}

		render () {
			return (
				<Wrapped
					{...this.props}
					changePosition={this.changePosition}
					follow={this.state.follow}
					destination={this.state.destination}
				/>
			);
		}
	};
});

const CompactMap = Skinnable(CompactMapBrains(CompactMapBase));

export default CompactMap;
