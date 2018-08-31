import {Cell, Column, Row} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import React from 'react';
import Touchable from '@enact/ui/Touchable';

import componentCss from './PopupMessage.less';

const TouchableDiv = Touchable('div');

const PopupMessageBase = kind({
	name: 'PopupMessage',
	styles: {
		css: componentCss,
		className: 'popupMessage'
	},
	render: ({...rest}) => {
		return (
			<TouchableDiv {...rest} />
		);
	}
});

const CenteredPopupMessage = kind({
	name: 'CenteredPopupMessage',
	styles: {
		css: componentCss,
		className: 'centeredPopupMessage'
	},
	render: ({children, css, ...rest}) => {
		return (
			<PopupMessageBase {...rest}>
				<Row
					className={css.outer}
				>
					<Cell />
					<Cell
						className={css.inner}
						component={Column}
						shrink
					>
						<Cell />
						<Cell
							shrink
						>
							{children}
						</Cell>
						<Cell />
					</Cell>
					<Cell />
				</Row>
			</PopupMessageBase>
		);
	}
});

export default PopupMessageBase;
export {CenteredPopupMessage, PopupMessageBase as PopupMessage, PopupMessageBase};
