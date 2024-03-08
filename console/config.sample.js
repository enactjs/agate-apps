export default {
	// For weather to work, you'll need to get an OpenWeatherMaps.org API key.
	// Here's where: https://openweathermap.org/appid
	weatherApiKey: '<Insert your OpenWeatherMaps API key here>',

	// Agate Console can use `GoogleMaps` or `MapBox` as providers for its maps. Set one of these two values to set the map provider.
	mapProvider: 'GoogleMaps',

	// Agate Console uses mapbox for its maps. You can obtain your API key by
	// visiting the following site: https://www.mapbox.com/help/define-access-token/
	mapApiKey: '<Insert your MapBox API key here>',

	// Agate Console uses Google Maps for its maps. You can obtain your API key by
	// visiting the following site: https://developers.google.com/maps/documentation/javascript/get-api-key
	googleMapsApiKey: '<Insert your Google Maps API key here>',

	// Some features of Google Maps Api require a map ID. You can generate a map id by
	// visiting the following site: https://console.cloud.google.com/google/maps-apis/studio/maps
	googleMapId: '<Insert your Google Maps Map Id here>',

	// Point this variable to the hostname (IP, domain, or localhost) of the services layer
	// The ROS server that we'll subscribe to get service topics.
	// Ex: localhost:9090
	servicesLayerHost: 'localhost:9090',

	// The host for the communication server that allows console to talk to co-pilot
	// A "host" is the combination of the hostname (like localhost) and a port number.
	// Most likely, this will be running on the same machine as this console app, but not mandatory.
	// Ex: localhost:3000
	communicationServerHost: 'localhost:3000'
};
