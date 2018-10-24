import kind from '@enact/core/kind';
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
		onSelect: PropTypes.func
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

	render: ({onSelect, onTabChange, ...rest}) => {
		return (
			<div {...rest}>
				<nav className={css.tools}>
					<Button alt="Fullscreen" icon="fullscreen" data-tabindex={getPanelIndexOf('map')} onSelect={onSelect} onKeyUp={onTabChange} onClick={onTabChange} />
				</nav>
				<MapCore />
			</div>
		);
	}
});

const CompactMap = Skinnable(CompactMapBase);

export default CompactMap;
