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
	const args = qs.parse((global.location && global.location.search) || '');
	const index = parseInt(args.index || 0);
	const skin = args.skin;
	const skinVariants = args.skinVariants;

	const onSelect = (ev) => {
		const params = qs.parse((global.location && global.location.search) || '');
		params.index = ev.index;
		const stringified = qs.stringify(params);

		global.history.pushState(ev, '', `?${stringified}`);
	};

	appElement = (
		<AppContextProvider
			defaultShowWelcomePopup={args.showWelcomePopup !== 'false'}
			defaultSkin={skin}
			defaultSkinVariants={skinVariants}
		>
			<App defaultIndex={index} onSelect={onSelect} />
		</AppContextProvider>
	);

	render(appElement, document.getElementById('root'));
}

export default appElement;
