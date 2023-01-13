/* eslint-disable react/jsx-no-bind */
/* global ENACT_PACK_ISOMORPHIC */
import 'mapbox-gl/dist/mapbox-gl.css';
import qs from 'query-string';
import {createRoot, hydrateRoot} from 'react-dom/client';

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

	const container = document.getElementById('root');

	if (ENACT_PACK_ISOMORPHIC) {
		hydrateRoot(container, appElement);
	} else {
		createRoot(container).render(appElement);
	}
}

export default appElement;
