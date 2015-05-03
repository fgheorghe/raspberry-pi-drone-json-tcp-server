/**
 Copyright (c) 2015 Grosan Flaviu Gheorghe.
 All rights reserved.

 Redistribution and use in source and binary forms are permitted
 provided that the above copyright notice and this paragraph are
 duplicated in all such forms and that any documentation,
 advertising materials, and other materials related to such
 distribution and use acknowledge that the software was developed
 by Grosan Flaviu Gheorghe. The name of
 Grosan Flaviu Gheorghe may not be used to endorse or promote products derived
 from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED ``AS IS'' AND WITHOUT ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 */
/**
 * Drone TCP Server.
 *
 * Required 'parameters' object keys are are:
 *
 * Port
 * DroneMotorController
 * Logger
 *
 * @constructor
 */
var DroneTcpServer = function(parameters) {
    // Prepare configuration parameters.
    this.Port = parameters.Port;
    this.DroneMotorController = parameters.DroneMotorController;
    this.Logger = parameters.Logger;

    // Initialise server.
    this.init();
}

/**
 * Loads dependencies, and creates listener.
 *
 * @function
 */
DroneTcpServer.prototype.init = function() {
    this.Logger.info("Creating TCP server on port: " + this.Port);

    // Create server.
    this.jsonServer = require('json-over-tcp').createServer(this.Port);

    // Bind event handlers.
    this.jsonServer.on('listening', this.ServerListeningEventHandler.bind(this));
    this.jsonServer.on('connection', this.ServerConnectionEventHandler.bind(this));
    this.jsonServer.on('error', this.ServerErrorEventHandler.bind(this));

    // Start listening.
    this.jsonServer.listen(this.Port);
}

/**
 * Handles TCP server errors.
 *
 * @param error
 *
 * @function
 */
DroneTcpServer.prototype.ServerErrorEventHandler = function(error) {
    this.Logger.error("Can not start TCP server: " + error);
    this.Logger.debug(JSON.stringify(error));
    // Terminate process.
    process.exit();
}

/**
 * Notifies the user that a server has started.
 *
 * @function
 */
DroneTcpServer.prototype.ServerListeningEventHandler = function() {
    this.Logger.info("Server started.");
}

/**
 * Handles an incoming connection.
 *
 * @param socket
 *
 * @function
 */
DroneTcpServer.prototype.ServerConnectionEventHandler = function(socket) {
    this.Logger.info("Connection from: " + socket.address().address);
    this.Logger.debug(JSON.stringify(socket.address()));

    // Bind socket event handlers.
    socket.on('data', this.SocketDataEventHandler.bind(this));
}

/**
 * Handles incoming socket data.
 *
 * Example Json objects:
 *
 * Set motor on pin 1 power to 10%, and motor on pin 2 power to 30%.
 *
 * Power: [{ Pin: 1, Power: 10 }, { Pin: 2, Power: 30 }]
 *
 * @param data
 *
 * @function
 */
DroneTcpServer.prototype.SocketDataEventHandler = function(data) {
    this.Logger.debug(JSON.stringify(data));

    // We are setting motor power.
    if (typeof data.Power !== "undefined") {
        this.DroneMotorController.setMotorPower(data.Power);
    } else {
        this.Logger.warn("Invalid command.");
        this.Logger.debug(JSON.stringify(data));
    }
}

// Finally, export the module.
module.exports = DroneTcpServer;