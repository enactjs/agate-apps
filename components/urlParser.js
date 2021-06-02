import qs from 'query-string';

// If value is in url as a param use that, if not pull from localstorage, if not fallback to config value
const getValue = (key, value) => {
	const parsed = qs.parse((global.location && global.location.search) || '');

	// add `|| value` to save the config file's contents into localStorage in addition to the query-string args
	if (parsed[key]) {
		if (typeof global !== 'undefined') {
			global.localStorage.setItem(key, parsed[key]);
		}
	}

	const newValue = parsed[key] || (global.localStorage && global.localStorage.getItem(key)) || value;

	return newValue;
};

const getConfig = (config) => {
	let newConfig = {};
	const parsed = qs.parse((global.location && global.location.search) || '');
	for (const key in config) {
		const value = config[key];

		newConfig[key] = getValue(key, value);
	}

	const stringified = qs.stringify(parsed);
	if (typeof window !== 'undefined') {
		global.history.replaceState('', '', (stringified ? `/?${stringified}` : ''));
	}

	return newConfig;
};

export {
	getConfig
};
