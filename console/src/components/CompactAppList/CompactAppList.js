import kind from '@enact/core/kind';
import {Row} from '@enact/ui/Layout';
import Droppable, {Draggable, ResponsiveBox} from '@enact/agate/DropManager';
import React from 'react';
import PropTypes from 'prop-types';

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
		<DropRow align="start space-evenly" {...rest} wrap>
			<DraggableAppIcon name="00" icon="compass">Navigation</DraggableAppIcon>
			<DraggableAppIcon name="01" icon="audio" onKeyUp={onTabChange} onClick={onTabChange}>Audio</DraggableAppIcon>
			<DraggableAppIcon name="02" icon="resumeplay">Multimedia</DraggableAppIcon>
			<DraggableAppIcon name="03" icon="gear" data-tabindex={getPanelIndexOf('settings')} onKeyUp={onTabChange} onClick={onTabChange}>Settings</DraggableAppIcon>
		</DropRow>
	)
});

const ResponsiveCompactAppList = ResponsiveBox(({containerShape, ...rest}) => {
	let axisAlign = 'center';
	if (containerShape.edges.left) axisAlign = 'start';
	if (containerShape.edges.right) axisAlign = 'end';
	return (
		<CompactAppList align={axisAlign + ' space-evenly'} {...rest} />
	);
});

export default ResponsiveCompactAppList;
