import React from 'react';
import kind from '@enact/core/kind';
import {Cell} from '@enact/ui/Layout';
import LabeledIconButton from '@enact/agate/LabeledIconButton';

import css from './AppIconCell.less';

const AppIconCell = kind({
	name: 'AppIconCell',
	styles: {
		css,
		className: 'iconCell'
	},

	render: ({children, ...rest}) => (
		<Cell component={LabeledIconButton} align="center" size={"40%"} {...rest}>{children}</Cell>
	)
});

export default AppIconCell;
