import kind from '@enact/core/kind';
import {Row} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';
import AppIconCell from '../AppIconCell';

const CompactAppList = kind({
	name: 'CompactAppList',

	propTypes: {
		onSelect: PropTypes.func
	},

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({onTabChange, ...rest}) => (
		<div props={rest}>
			<Row align="start center">
				<AppIconCell size="40%" icon="compass">Navigation</AppIconCell>
				<AppIconCell size="40%" icon="audio">Audio</AppIconCell>
			</Row>
			<Row align="start center">
				<AppIconCell size="40%" icon="resumeplay">Multimedia</AppIconCell>
				<AppIconCell size="40%" icon="gear" data-tabindex={4} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
			</Row>
		</div>
	)
});

export default CompactAppList;
