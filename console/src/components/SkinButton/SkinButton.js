import Button from '@enact/agate/Button';

import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';


const SkinButton = kind({
	name: 'SkinButton',

	handlers: {
		onTap: (ev, {skinOption, ...props}) => {
			forward('onTap', {skinOption}, props)
		}
	},

	render: (props) => (
		<Button {...props} />
	)
});

export default SkinButton;