import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';
import compose from 'ramda/src/compose';
import React from 'react';

import Button from '@enact/agate/Button';
import Skinnable from '@enact/agate/Skinnable';

import css from './ConsoleToggleButton.less';


const ConsoleToggleButtonBase = kind({
	name: 'ConsoleToggleButton',

	styles: {
		css,
		className: 'consoleToggleButton'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected}),
	},

	render: ({selected, ...rest}) => {
		return (
			<Button {...rest} css={css} aria-pressed={selected} selected={selected} />
		);
	}
});


const ConsoleToggleButtonDecorator = compose(
	Pure,
	Toggleable({prop: 'selected', toggleProp: 'onTap'}),
	Skinnable
);


const ConsoleToggleButton = ConsoleToggleButtonDecorator(ConsoleToggleButtonBase);

export default ConsoleToggleButton;
export {
	ConsoleToggleButton,
	ConsoleToggleButtonBase
};
