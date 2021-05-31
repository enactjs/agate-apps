import kind from '@enact/core/kind';
import {Cell} from '@enact/ui/Layout';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import Skinnable from '@enact/agate/Skinnable';

import css from './AppIconCell.module.less';

const AppIconCell = kind({
	name: 'AppIconCell',

	styles: {
		css,
		className: 'iconCell',
		publicClassNames: true
	},

	render: ({align, children, className, shrink, size = 180, style, ...rest}) => (
		<Cell align={align} size={size} shrink={shrink} className={className} style={style}>
			<LabeledIconButton css={css} {...rest}>{children}</LabeledIconButton>
		</Cell>
	)
});

export default Skinnable(AppIconCell);
