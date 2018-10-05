import kind from '@enact/core/kind';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import React from 'react';
import PropTypes from 'prop-types';

import DropZone from '../DropZone';
import AppIconCell from '../AppIconCell';

const DropZoneReadyRow = ({...props}) => {
	delete props.arranging;
	return (<Row {...props} />);
};
const DropZoneRow = Slottable({slots: ['00', '01']}, DropZone(DropZoneReadyRow));

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
		<Column {...rest}>
			<Cell shrink>
				<DropZoneRow align="start space-evenly" id="row0">
					<AppIconCell id="slot01" data-slot="00" icon="compass">Navigation</AppIconCell>
					<AppIconCell id="slot02" data-slot="01" icon="audio" onKeyUp={onTabChange} onClick={onTabChange}>Audio</AppIconCell>
				</DropZoneRow>
			</Cell>
			<Cell shrink>
				<DropZoneRow align="start space-evenly" id="row1">
					<AppIconCell id="slot01" data-slot="00" icon="resumeplay">Multimedia</AppIconCell>
					<AppIconCell id="slot02" data-slot="01" icon="gear" data-tabindex={5} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
				</DropZoneRow>
			</Cell>
		</Column>
	)
});

export default CompactAppList;
