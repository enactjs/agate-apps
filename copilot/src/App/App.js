import AgateDecorator from '@enact/agate/AgateDecorator';
import kind from '@enact/core/kind';
import qs from 'query-string';
import React from 'react';

import css from './App.less';

const args = qs.parse(typeof window !== 'undefined' ? window.location.search : '');

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => {
		const {url} = args;
		return (
			<div {...props}>
				<iframe src={url} />
			</div>
		);
	}
});

export default AgateDecorator(App);
