const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin: ['http://localhost:8080', "http://localhost:8081"],
		credentials: true
	},
});

// const adDuration = 10000; // 10 s
// const adInterval = 300000; // 5 m
// const adTimers = {};

http.listen(3000, () => {
	console.log('listening on *:3000'); // eslint-disable-line no-console
});

io.on('connection', socket => {
	// Just one end point to send any data to any route for now. This may change as we get more requirements.
	socket.on('SEND_DATA', (data) => {
		if (data.route) {
			io.emit(data.route, data);
		}
	});

	// socket.on('VIDEO_SENT', ({id}) => {
	// 	// TODO: make a proper ad management/delivery mechanism
	// 	if (adTimers[id]) {
	// 		clearInterval(adTimers[id]);
	// 	}
	// 	adTimers[id] = setInterval(() => {
	// 		io.emit('SHOW_AD', {
	// 			adContent: 'Brought to you by Agate',
	// 			duration: adDuration
	// 		});
	// 	}, adInterval);
	// });
});
