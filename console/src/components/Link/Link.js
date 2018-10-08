import React from 'react';
import AppContextConnect from '../../App/AppContextConnect';
import {forward} from '@enact/core/handle';

const onSelect = (updateAppState, props) => (ev) => {
	const {keyCode, type} = ev;
	if (props.index) {
		updateAppState((state) => {
			if (keyCode === 13 || type === 'click') {
				state.index = props.index;
			}
		});
	}
};

const ConnectedLink = AppContextConnect(({updateAppState}, props) => ({
	onClick: onSelect(updateAppState, props),
	onKeyUp: onSelect(updateAppState, props)
}));

export default ConnectedLink;
