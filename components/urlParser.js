import qs from 'query-string';

// If value is in url as a param use that, if not pull from localstorage, if not fallback to config value
const getValue = (key, value) => {
	const parsed = qs.parse(window.location.search);

	if (parsed[key]) {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(key, parsed[key]);
		}
	}

	const newValue = parsed[key] || window.localStorage.getItem(key) || value;

	// Set new value to url
	parsed[key] = newValue;

	return newValue;
};

const getConfig = (config) => {
	let newConfig = {};
	const parsed = qs.parse(window.location.search);
	for (let key in config) {
		const value = config[key];

		newConfig[key] = getValue(key, value);
	}

	const stringified = qs.stringify({...parsed, ...newConfig});
	if (typeof window !== 'undefined') {
		window.history.replaceState('', '', `/?${stringified}`);
	}

	return newConfig;
};

export {
	getConfig
};