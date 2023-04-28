const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin: ['http://localhost:8080', 'http://localhost:8081'],
		credentials: true
	}
});

let enabled = true;
let selectedOption = 0;

const options = [
	{name: 'Yes', value: 0},
	{name: 'No', value: 1}
];

const clearScreen = () => {
	process.stdout.moveCursor(0, -5);
	process.stdout.clearScreenDown();
};

const displayOptions = () => {
	enabled = selectedOption === 0;
	process.stdout.write(`Fake time: \x1b[1m${enabled ? 'enabled' : 'disabled'}\x1b[0m\n\n`);
	process.stdout.write('Enable fake time:\n');
	options.forEach((option, index) => {
		const isSelected = index === selectedOption;
		process.stdout.write(`${isSelected ? '>' : ' '} ${option.name}\n`);
	});
};

const runTerminal = () => {
	process.stdin.setRawMode(true);
	displayOptions();
	process.stdin.on('data', (data) => {
		const input = data.toString().trim();
		if (input === '\u0003') { // Handle CTRL+C
			process.exit();
		} else if (input === '\u001B[A') { // Handle UP arrow
			selectedOption = selectedOption === undefined ? options.length - 1 : (selectedOption - 1 + options.length) % options.length; // eslint-disable-line no-undefined
			clearScreen();
			displayOptions();
		} else if (input === '\u001B[B') { // Handle DOWN arrow
			selectedOption = selectedOption === undefined ? 0 : (selectedOption + 1) % options.length; // eslint-disable-line no-undefined
			clearScreen();
			displayOptions();
		}
	});
};

http.listen(3002, () => {
	runTerminal();
});

io.on('connection', socket => {
	setInterval(() => {
		socket.emit('FAKE_TIME', enabled);
	}, 1000);
});
