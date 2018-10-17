var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.send('<h1>Hello !! world</h1>');
});

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('video', url => {
        console.log('log', url);
        io.emit('video', url);
    })
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});