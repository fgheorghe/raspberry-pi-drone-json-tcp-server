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
// Load dependencies.
var DroneTcpServer = require('./drone-tcp-server.js');
var DroneMotorController = require('./drone-motor-controller.js');
var Log = require('log4js'),
    Logger;

// Load configuration.
try {
    var Configuration = require('ini').parse(require('fs').readFileSync('./configuration.ini', 'utf-8'));
} catch (Exception) {
    console.log("Can not read configuration file: " + Exception);
    // Terminate process.
    process.exit();
}

// Prepare logging.
Log.loadAppender('file');
Log.addAppender(Log.appenders.file(Configuration.logging.file), 'drone-server');
Logger = Log.getLogger('drone-server');
Logger.setLevel(Configuration.logging.level);

// Log initialisation.
Logger.info("Daemon configuration loaded.");
Logger.debug(Configuration);

// Add process exception handling.
process.on('uncaughtException', function(err) {
    Logger.error('Caught process exception: ' + err);
    Logger.debug(JSON.stringify(err));
});

// Create server.
droneTcpServer = new DroneTcpServer({
    Port: Configuration.server.port,
    DroneMotorController: new DroneMotorController({
        Logger: Logger,
        ServerBlasterDevicePath: Configuration.servoblaster.device_path
    }),
    Logger: Logger
});