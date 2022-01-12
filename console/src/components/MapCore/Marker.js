import kind from '@enact/core/kind';
import Skinnable from '@enact/agate/Skinnable';
// import PropTypes from 'prop-types';

import css from './Marker.module.less';

const MarkerBase = kind({
	name: 'Marker',

	styles: {
		css,
		className: 'marker',
		publicClassNames: true
	},

	render: ({children, ...rest}) => (
		<div {...rest}>
			{children}
		</div>
	)
});

const Marker = Skinnable(MarkerBase);

export default Marker;
export {
	Marker,
	MarkerBase
};
