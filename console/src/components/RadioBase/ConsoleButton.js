import Button from '@enact/agate/Button';

import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import compose from 'ramda/src/compose';
import kind from '@enact/core/kind';
import React from 'react';

import css from './ConsoleButton.less';

const ConsoleButtonBase = kind({
	name: 'ConsoleButton',

	propTypes:{},

	styles: {
		css,
		className: 'ConsoleButton'
	},

	render: ({css, ...rest}) => (
		<Button {...rest} css={css} />
	)
});

const ConsoleButtonDecorator = compose(
  Pure,
	Spottable
);

const ConsoleButton = ConsoleButtonDecorator(ConsoleButtonBase);

export default ConsoleButtonBase;
