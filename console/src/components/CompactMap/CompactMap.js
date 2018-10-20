import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import Button from '@enact/agate/Button';
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
		position: PropTypes.array
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

	render: ({changePosition, changeFollow, follow, onSelect, onTabChange, position, ...rest}) => {
		return (
			<div {...rest}>
				<nav className={css.tools}>
					<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
					<Button alt="Recenter" icon="arrowhookleft" onClick={changePosition} />
					<Button alt="Follow" active={follow} icon="forward" onClick={changeFollow} />
				</nav>
				<MapCore follow={follow} position={position} />
			</div>
		);
	}
});

const CompactMapBrains = hoc((configHoc, Wrapped) => {
	const positions = [
		[-121.979125, 37.405189],
		[-122.399391029, 37.7908574786]
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
				positionIndex: positionIndex > 0 ? 0 : 1
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
