'use strict';

var db = require('../db');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

db.initDB().then(function () {
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		next();
	});
	app.get('/', function (req, res) {
		res.send('data');
	});

	app.get('/items', function (req, res) {
		db.getItems().then(function (data) {
			res.send(data);
		});
	});

	app.delete('/items/:id', function (req, res) {
		res.send(db.deleteItem(req.params.id));
	});

	http.listen(3000, function () {
		console.log('listening on *:3000');
	});

	io.on('connection', function (socket) {
		console.log('a user connected');
		socket.on('VIDEO_ADD_CONSOLE', function (video) {
			db.saveItems(video).then(function (res) {
				io.emit('VIDEO_ADD_COPILOT', video);
			});
		});
		socket.on('GET_VIDEOS', function () {
			db.getItems().then(function (res) {
				io.emit('GET_VIDEOS', res);
			});
		});
	});
});