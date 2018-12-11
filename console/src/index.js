/* eslint-disable react/jsx-no-bind */

import React from 'react';
import qs from 'query-string';
import {render} from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

import App from './App';
import AppContextProvider from './App/AppContextProvider';

let appElement = <App />;

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	const args = qs.parse(window.location.search);
	const index = parseInt(args.index || 0);
	const skin = args.skin;

	const onSelect = (ev) => {
		const params = qs.parse(window.location.search);
		params.index = ev.index;
		const stringified = qs.stringify(params);

		window.history.pushState(ev, '', `/?${stringified}`);
	};

	appElement = (
		<AppContextProvider
			defaultIndex={index}
			defaultShowWelcomePopup={args.showWelcomePopup !== 'false'}
			defaultSkin={skin}
		>
			<App onSelect={onSelect} />
		</AppContextProvider>
	);

	render(appElement, document.getElementById('root'));
}

export default appElement;
