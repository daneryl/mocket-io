"use strict";
var Adapter      = require("./Adapter");
var ServerSocket = require("./ServerSocket");

function createBridge (client, server) {
	var clientEmit = server.local.bind(server);
	var serverEmit = client.emit.bind(client);

	client.emit  = clientEmit;
	server.local = serverEmit;
}

function Namespace (server, name) {
	this.adapter = new Adapter(this);
	this.fns     = [];
	this.name    = name;
	this.server  = server;
	this.sockets = [];
}

Namespace.prototype.add = function (client) {
	var socket = new ServerSocket(this);

	createBridge(client, socket);
	this.run(socket);
	this.sockets.push(socket);
	return socket;
};

Namespace.prototype.remove = function (socket) {
	var index = this.sockets.indexOf(socket);

	if (-1 !== index) {
		this.sockets.splice(index, 1);
	}
};

Namespace.prototype.run = function (socket) {
	var middleware = this.fns.slice();

	(function next () {
		var fn = middleware.shift();

		if (fn) {
			fn(socket, next);
		}
	})();
};

Namespace.prototype.use = function (middleware) {
	this.fns.push(middleware);
	return this;
};

module.exports = Namespace;