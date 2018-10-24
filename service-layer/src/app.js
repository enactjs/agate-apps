let db = require('../db');
let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

db.initDB().then(() => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		next();
	});
	app.get('/', function (req, res) {
		res.send('data');
	});

	app.get('/items', function (req, res) {
		db.getItems().then(data => {
			res.send(data);
		});
	});

	app.delete('/items/:id', (req, res) => {
		res.send(db.deleteItem(req.params.id));
	})

	http.listen(3000, () => {
		console.log('listening on *:3000');
	});


	io.on('connection', socket => {
		console.log('a user connected');
		socket.on('VIDEO_ADD_CONSOLE', video => {
			db.saveItems(video).then(res => {
				io.emit('VIDEO_ADD_COPILOT', video);
			});
		});
		socket.on('GET_VIDEOS', () => {
			db.getItems().then(res => {
				io.emit('GET_VIDEOS', res);
			});
		});
	});
});

