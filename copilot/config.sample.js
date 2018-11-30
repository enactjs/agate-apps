import {getConfig} from '../components/urlParser';

const config = {
	// The host for the communication server that allows console to talk to co-pilot
	// A "host" is the combination of the hostname (like localhost) and a port number.
	// Ex: localhost:3000 or IpAddress:Port
	communicationServerHost: 'localhost:3000'
};

const newConfig = getConfig(config);

export default newConfig;
