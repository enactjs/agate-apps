import React from 'react';
import qs from 'query-string';
import {render} from 'react-dom';
import App from './App';

let appElement = <App />;

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	const args = qs.parse(window.location.search);
	const index = parseInt(args.index || 0);
	const skin = args.skin;
	const onSelect = (ev) => window.history.pushState(ev, '', `?index=${ev.index}`)
	appElement = (
		<App
			defaultIndex={index}
			onSelect={onSelect}
			skin={skin}
		/>
	);
	render(appElement, document.getElementById('root'));
}

export default appElement;
