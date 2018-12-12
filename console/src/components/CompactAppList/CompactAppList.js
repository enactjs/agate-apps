import kind from '@enact/core/kind';
import {Row} from '@enact/ui/Layout';
import Droppable, {Draggable, ResponsiveBox} from '@enact/agate/DropManager';
import React from 'react';
import PropTypes from 'prop-types';

import Widget from '../Widget';
import AppIconCell from '../AppIconCell';
import {getPanelIndexOf} from '../../App';

const DropReadyRow = ({...props}) => {
	return (<Row {...props} />);
};
const DropRow = Droppable({slots: ['00', '01']}, DropReadyRow);
const DraggableAppIcon = Draggable(AppIconCell);

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
				<DraggableAppIcon name="00" icon="compass">Navigation</DraggableAppIcon>
				<DraggableAppIcon name="01" icon="audio" onKeyUp={onTabChange} onClick={onTabChange}>Audio</DraggableAppIcon>
				<DraggableAppIcon name="02" icon="resumeplay" data-tabindex={getPanelIndexOf('multimedia')} onKeyUp={onTabChange} onClick={onTabChange}>Multimedia</DraggableAppIcon>
				<DraggableAppIcon name="03" icon="gear" data-tabindex={getPanelIndexOf('settings')} onKeyUp={onTabChange} onClick={onTabChange}>Settings</DraggableAppIcon>
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
