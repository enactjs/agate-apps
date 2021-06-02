import {render} from 'react-dom';
import App from './App';

const appElement = (
	<App
		skin="gallium"
		accent="#8b7efe"
		highlight="#e16253"
	/>
);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	render(appElement, document.getElementById('root'));
}

export default appElement;
