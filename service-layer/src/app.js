let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

http.listen(3000, () => {
	console.log('listening on *:3000');
});

io.on('connection', socket => {
	// Just one end point to end any data to any route for now. This may change as we get more requirements.
	socket.on('SEND_DATA', data => {
		io.emit(data.route, data);
	});
});
