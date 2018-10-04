import kind from '@enact/core/kind';
import {Cell, Row} from '@enact/ui/Layout';
import React from 'react';
import AppIconCell from '../AppIconCell';

const CompactHvac = kind({
	name: 'CompactHVAC',

	styles: {
		className: 'compact'
	},

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({onTabChange, ...rest}) => (
    <Cell props={rest}>
      <Row align="start center">
        <AppIconCell size="40%" icon="compass">Navigation</AppIconCell>
        <AppIconCell size="40%" icon="audio" data-tabindex={3} onKeyUp={onTabChange} onClick={onTabChange}>Audio</AppIconCell>
      </Row>
      <Row align="start center">
        <AppIconCell size="40%" icon="resumeplay">Multimedia</AppIconCell>
        <AppIconCell size="40%" icon="gear" data-tabindex={4} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
      </Row>
    </Cell>
)
});

export default CompactHvac;
