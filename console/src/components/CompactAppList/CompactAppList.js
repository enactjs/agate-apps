import kind from '@enact/core/kind';
import {Row} from '@enact/ui/Layout';
import Slottable from '@enact/ui/Slottable';
import DropManager, {ResponsiveBox} from '@enact/agate/DropManager';
import React from 'react';
import PropTypes from 'prop-types';

import AppIconCell from '../AppIconCell';

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
		<DropRow align="start space-evenly" {...rest} wrap>
			<AppIconCell data-slot="00" icon="compass">Navigation</AppIconCell>
			<AppIconCell data-slot="01" icon="audio" onKeyUp={onTabChange} onClick={onTabChange}>Audio</AppIconCell>
			<AppIconCell data-slot="02" icon="resumeplay">Multimedia</AppIconCell>
			<AppIconCell data-slot="03" icon="gear" data-tabindex={5} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
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
