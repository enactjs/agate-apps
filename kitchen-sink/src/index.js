import React from 'react';
import {render} from 'react-dom';
import qs from 'query-string';

import App from './App';

let appElement = <App />;

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	const args = qs.parse(window.location.search);
	const skin = args.skin || 'cobalt';

	appElement = (
		<App
			skin={skin}
			accent="#FC7982"
			highlight="#FFFFFF"
		/>
	);

	render(appElement, document.getElementById('root'));
}

export default appElement;
