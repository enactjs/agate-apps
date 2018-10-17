import kind from '@enact/core/kind';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import DropManager from '@enact/agate/DropManager';
import React from 'react';
import PropTypes from 'prop-types';

import AppIconCell from '../AppIconCell';
import {getPanelIndexOf} from '../../App';

const DropReadyRow = ({...props}) => {
	delete props.arranging;
	return (<Row {...props} />);
};
const DropRow = Slottable({slots: ['00', '01']}, DropManager(DropReadyRow));

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
				<DropRow align="start space-evenly" id="row0">
					<AppIconCell id="slot01" data-slot="00" icon="compass">Navigation</AppIconCell>
					<AppIconCell id="slot02" data-slot="01" icon="audio" onKeyUp={onTabChange} onClick={onTabChange}>Audio</AppIconCell>
				</DropRow>
			</Cell>
			<Cell shrink>
				<DropRow align="start space-evenly" id="row1">
					<AppIconCell id="slot01" data-slot="00" icon="resumeplay" data-tabindex={getPanelIndexOf('multimedia')} onClick={onTabChange}>Multimedia</AppIconCell>
					<AppIconCell id="slot02" data-slot="01" icon="gear" data-tabindex={getPanelIndexOf('settings')} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
				</DropRow>
			</Cell>
		</Column>
	)
});

export default CompactAppList;
