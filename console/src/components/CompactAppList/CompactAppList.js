import kind from '@enact/core/kind';
import {Row} from '@enact/ui/Layout';
import Droppable, {ResponsiveBox} from '@enact/agate/DropManager';
import React from 'react';
import PropTypes from 'prop-types';

import Widget from '../Widget';
import AppIconCell from '../AppIconCell';
import {getPanelIndexOf} from '../../App';

const DropReadyRow = ({...props}) => {
	return (<Row {...props} />);
};
const DropRow = Droppable({slots: ['00', '01']}, DropReadyRow);

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
		<Widget {...rest} title="Favorite Apps" description="A selection of your favorite apps" view="applist">
			<DropRow align="start space-around" wrap>
				<AppIconCell shrink size="24%" icon="compass">Navigation</AppIconCell>
				<AppIconCell shrink size="24%" icon="audio" onKeyUp={onTabChange} onClick={onTabChange}>Audio</AppIconCell>
				<AppIconCell shrink size="24%" icon="rearscreen" data-tabindex={getPanelIndexOf('multimedia')} onKeyUp={onTabChange} onClick={onTabChange}>Multimedia</AppIconCell>
				<AppIconCell shrink size="24%" icon="gear" data-tabindex={getPanelIndexOf('settings')} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
			</DropRow>
		</Widget>
	)
});

const ResponsiveCompactAppList = ResponsiveBox(({containerShape, ...rest}) => {
	let axisAlign = 'center';
	if (containerShape.edges.left) axisAlign = 'start';
	if (containerShape.edges.right) axisAlign = 'end';
	return (
		<CompactAppList align={axisAlign + ' space-around'} {...rest} />
	);
});

export default ResponsiveCompactAppList;
