export default {
	// For weather to work, you'll need to get an OpenWeatherMaps.org API key.
	// Here's where: https://openweathermap.org/appid
	weatherApiKey: 'c9de35da438a22a99da46bcf04a2b7af',

	// Agate Console uses mapbox for its maps. You can obtain your API key by
	// visiting the following site: https://www.mapbox.com/help/define-access-token/
	mapApiKey: 'pk.eyJ1IjoiYmFla3dvbyIsImEiOiJjanNjdWpyMGkwMWRsM3ltZDN2b3VtNXFsIn0.OWMt7Rh01b7iGZYXnGdr_g',

	// Point this variable to the hostname (IP, domain, or localhost) of the services layer
	// The ROS server that we'll subscribe to to get service topics.
	// Ex: localhost:9090
	servicesLayerHost: '127.0.0.1:9090',

	// The host for the communication server that allows console to talk to co-pilot
	// A "host" is the combination of the hostname (like localhost) and a port number.
	// Most likely, this will be running on the same machine as this console app, but not mandatory.
	// Ex: localhost:3000
	communicationServerHost: '127.0.0.1:3000'
};
