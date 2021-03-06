import React from 'react';
import {render} from 'react-dom';
import App from './App';

const appElement = (
	<App
		skin="cobalt"
		accent="#FC7982"
		highlight="#FFFFFF"
	/>
);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	render(appElement, document.getElementById('root'));
}

export default appElement;
