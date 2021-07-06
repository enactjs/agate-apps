import {render} from 'react-dom';
import App from './App';

const appElement = (<App skin="carbon" accent="#03A9F4" highlight="#00408A" />);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	render(appElement, document.getElementById('root'));
}

export default appElement;
