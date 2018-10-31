import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import Button from '@enact/agate/Button';
import ToggleButton from '@enact/agate/ToggleButton';
import Skinnable from '@enact/agate/Skinnable';
import React from 'react';
import PropTypes from 'prop-types';

import {getPanelIndexOf} from '../../App';

import MapCore from '../MapCore';

import css from './CompactMap.less';

const CompactMapBase = kind({
	name: 'CompactMap',

	propTypes: {
		changePosition: PropTypes.func,
		onSelect: PropTypes.func,
		position: PropTypes.object
	},

	styles: {
		css,
		className: 'compactMap'
	},

	handlers: {
		onSetDestination: (ev, {position, setDestination}) => {
			// console.log('setDestination:', position);
			if (position) {
				// console.log('sending position:', position);
				setDestination({destination: position});
			}
		},
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({changePosition, changeFollow, follow, onSelect, onTabChange, position, onSetDestination, ...rest}) => {
		delete rest.setDestination;
		return (
			<div {...rest}>
				<nav className={css.tools}>
					<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
					<Button alt="Recenter" icon="arrowhookleft" onClick={changePosition} />
					<Button alt="Navigate Here" icon="play" onClick={onSetDestination} />
					<ToggleButton alt="Follow" selected={follow} underline icon="forward" onClick={changeFollow} />
				</nav>
				<MapCore follow={follow} position={position} />
			</div>
		);
	}
});

const CompactMapBrains = hoc((configHoc, Wrapped) => {
	const positions = [
		// {lat: 37.405189, lon: -121.979125},
		{lat: 37.788818, lon: -122.404568}, // LG office
		{lat: 37.791356, lon: -122.400823}, // Blue Bottle Coffee
		{lat: 37.788988, lon: -122.401076},
		{lat: 37.7908574786, lon: -122.399391029},
		{lat: 37.786116, lon: -122.402140}
		// {lon: -123.399391029, lat: 38.7908574786}
		// [-120.979125, 39.405189]
	];

	return class extends React.Component {
		static displayName = 'CompactMapBrains';
		constructor (props) {
			super(props);
			this.state = {
				positionIndex: 0,
				follow: false
			};
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
					position={positions[this.state.positionIndex]}
				/>
			);
		}
	};
});

const CompactMap = Skinnable(CompactMapBrains(CompactMapBase));

export default CompactMap;
