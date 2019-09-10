import React from 'react';
import {render} from 'react-dom';
import App from './App';

const appElement = (
	<App
		skin="gallium"
		accent="#8b7efe"
		highlight="#5e5e5e"
	/>
);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	render(appElement, document.getElementById('root'));
	if (window.PalmSystem) {
		window.PalmSystem.setWindowProperty('needFocus', 'true');
		window.PalmSystem.setInputRegion(
			[
				{'x': 0, 'y': 0, 'width': 1920, 'height': 270}
			]
		);
	}
}

export default appElement;
