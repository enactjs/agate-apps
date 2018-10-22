let db = require('../db');
let http = require('http').createServer();
let io = require('socket.io')(http);

db.initDB().then(() => {
	http.listen(3000, () => {
		console.log('listening on *:3000');
	});

	io.on('connection', socket => {
		console.log('a user connected');
		socket.on('VIDEO_ADD_CONSOLE', video => {
			db.saveItems(video).then(res => {
				console.log(res);
				io.emit('VIDEO_ADD_COPILOT', video);
			});
		});
	});
});

