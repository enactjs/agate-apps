import qs from 'query-string';


const getValue = (key, value) => {
	const parsed = qs.parse(window.location.search);
	console.log(parsed)
	if (parsed[key]) {
		window.localStorage.setItem(key, parsed[key]);
	}

	const newValue = parsed[key] || window.localStorage.getItem(key) || value;

	// Set new value to url
	parsed[key] = newValue;

	return newValue;
};

// If value is in url as a param use that, if not pull from localstorage, if not fallback to value
const getConfig = (config) => {
	let newConfig = {};
	const parsed = qs.parse(window.location.search);
	for (let key in config) {
		const value = config[key];

		newConfig[key] = getValue(key, value);
	}

	const stringified = qs.stringify({...parsed, ...newConfig});
	window.history.replaceState('', '', `/?${stringified}`);

	return newConfig;
};

export {
	getConfig
};
