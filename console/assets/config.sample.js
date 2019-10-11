/*
 * Important
 * This file is the console app configuration file. If you create dist, you need to change the file name to config.js and put it in the assets folder.
 */

// API keys
window.mapApiKey = '';
window.weatherApiKey = '';

// Bluetooth boundary
window.rssiLaura = -55;
window.rssiThomas = -55;


// Server Hosts
window.carImageHost = '127.0.0.1:9000';
window.communicationServerHost = '127.0.0.1:3303';
window.servicesLayerHost = '127.0.0.1:9090';

// Multimedia configs
window.multimedia = 'streaming';
/*
 * If there is a problem playing the video, please change to `local`.
 * e.g.> window.multimedia = 'local';
 */
window.multimediaProduct = 'youtube';
/*
 * If you want to change the multimedia product, please change to `sony`.
 * e.g.> window.multimediaProduct = 'sony';
 */
