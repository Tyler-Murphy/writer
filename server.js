var http = require('http');
var fs = require('q-io/fs');
var socketIo = require('socket.io');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var home_directory = process.env.OPENSHIFT_HOMEDIR || __dirname;

var users = [];

var server = http.createServer(function (request, response) {
	fs.read(home_directory + '/index.html').then(function(file) {
		response.writeHead(200);
		return response.end(file);
	}).catch(function(error) {
		response.writeHead(500);
		return response.end(error.stack);
	});
});

var io = socketIo(server)

io.on('connection', function(socket) {
	var userAdded = false;
	console.log('someone connected');

	socket.on('add user', function(username) {
		if (users.indexOf(username) !== -1) {
			socket.emit('login failed', { reason: 'username taken... try a different one' });
			return;
		}
		socket.username = username;
		socket.emit('login', { users: users });
		users.push(username);
		userAdded = true;
		socket.broadcast.emit('new user', { user: username });
	});

	socket.on('character', function(character) {
		console.log(character);
		socket.broadcast.emit('other user character', {
			user: socket.username,
			character: character
		});
	});


	socket.on('key', function(keyString) { console.log(keyString); });
});

server.listen(server_port, server_ip_address, function() {
	console.log("Listening on " + server_ip_address + ':' + server_port);
})