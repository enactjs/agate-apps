import React from 'react';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

const CompactGps = kind({
	name: 'CompactGPS',

	styles: {
		className: 'compactGps'
	},

	defaultProps: {
	},

	render: ({temp, ...rest}) => (
        <div></div>
    )
});

export default CompactGps;
