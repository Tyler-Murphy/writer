var http = require('http');
var fs = require('q-io/fs');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

function startApp() {
	http.createServer(handleRequest).listen(server_port, server_ip_address, function() {
		console.log("Listening on " + server_ip_address + ':' + server_port);
	})
}

function handleRequest(request, response) {
	fs.read(__dirname + '/index.html', ).then(function(file) {
		response.writeHead(200);
		return response.end(file);
	}).catch(function(error) {
		response.writeHead(500);
		return response.end(error.stack);
	});
}

startApp();