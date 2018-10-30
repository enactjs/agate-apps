let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let adDuration = 10000; // 10 s
let adInterval = 300000; // 5 m

http.listen(3000, () => {
	console.log('listening on *:3000');
});

io.on('connection', socket => {
	// Just one end point to end any data to any route for now. This may change as we get more requirements.
	socket.on('SEND_DATA', (data) => {
		if (data.route) {
			io.emit(data.route, data);
		}
	});

	socket.on('COPILOT_CONNECT', () => {
		io.emit('REQUEST_VIDEO');
		// TODO: make a proper ad management/delivery mechanism

		setInterval(() => {
			io.emit('SHOW_AD', {
				adContent: 'Brought to you by Agate',
				duration: adDuration
			});
		}, adInterval);
	});
});
