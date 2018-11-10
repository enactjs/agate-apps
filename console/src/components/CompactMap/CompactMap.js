import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import Button from '@enact/agate/Button';
import ToggleButton from '@enact/agate/ToggleButton';
import Skinnable from '@enact/agate/Skinnable';
import React from 'react';
import PropTypes from 'prop-types';

import {getPanelIndexOf} from '../../App';
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

	render: ({changePosition, changeFollow, destination, follow, onSelect, onTabChange, onSetDestination, proposedDestination, ...rest}) => {
		return (
			<div {...rest}>
				<nav className={css.tools}>
					<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
					<Button alt="Propose new destination" icon="arrowhookleft" onClick={changePosition} />
					<Button alt="Navigate Here" icon="play" onClick={onSetDestination} />
					<ToggleButton alt="Follow" selected={follow} underline icon="forward" onClick={changeFollow} />
				</nav>
				<MapCore destination={destination} follow={follow} proposedDestination={proposedDestination} />
			</div>
		);
	}
});

const CompactMapBrains = hoc((configHoc, Wrapped) => {
	const positions = [
		{lat: 37.788818, lon: -122.404568}, // LG office
		{lat: 37.791356, lon: -122.400823}, // Blue Bottle Coffee
		{lat: 37.788988, lon: -122.401076},
		{lat: 37.7908574786, lon: -122.399391029},
		{lat: 37.786116, lon: -122.402140}
	];

	return class extends React.Component {
		static displayName = 'CompactMapBrains';
		constructor (props) {
			super(props);
			this.state = {
				positionIndex: 0,
				destination: null,
				follow: false
			};
		}

		handleSetDestination = () => {
			// Take our current position and assign it as our internal (local to this HOC) destination
			this.setState(({positionIndex}) => ({destination: [positions[positionIndex]]}));
		}

		changePosition = () => {
			this.setState(({positionIndex}) => ({
				// go to the next position in the list
				positionIndex: ((positionIndex + 1) % positions.length)
			}));
		}

		changeFollow = () => {
			this.setState(({follow}) => ({
				follow: !follow
			}));
		}

		render () {
			return (
				<Wrapped
					{...this.props}
					changePosition={this.changePosition}
					changeFollow={this.changeFollow}
					follow={this.state.follow}
					onSetDestination={this.handleSetDestination}
					destination={this.state.destination}
					proposedDestination={[positions[this.state.positionIndex]]}
				/>
			);
		}
	};
});

const CompactMap = Skinnable(CompactMapBrains(CompactMapBase));

export default CompactMap;
