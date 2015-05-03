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
 * Drone Motor Controller.
 *
 * Required 'parameters' object keys are are:
 *
 * Logger
 * ServerBlasterDevicePath
 *
 * @constructor
 */
var DroneMotorController = function(parameters) {
    this.Logger = parameters.Logger;
    this.ServerBlasterDevicePath = parameters.ServerBlasterDevicePath;

    // Initialize.
    this.init();
}

/**
 * Loads dependencies.
 *
 * @function
 */
DroneMotorController.prototype.init = function() {
    // Load dependencies.
    this.fs = require('fs');
}

/**
 * Sets motor power - for an array of motors.
 *
 * @param motorPower Array of Pin and Power pairs. Power is a % value, while pins are servoblaster pin
 * ids for each motor:
 * https://github.com/richardghirst/PiBits/tree/master/ServoBlaster
 *
 */
DroneMotorController.prototype.setMotorPower = function(motorPower) {
    var i, string = "";
    for (i = 0; i < motorPower.length; i++) {
        this.Logger.debug("Pin power: " + motorPower[i].Pin + " - " + motorPower[i].Power);
        string += motorPower[i].Pin + '=' + motorPower[i].Power + '%\n';
    }

    this.fs.appendFile(this.ServerBlasterDevicePath, string, function (err) {
        if (err) {
            this.Logger.error("Can not write to " + this.ServerBlasterDevicePath + ": " + err);
            this.Logger.debug(JSON.stringify(err));
        }
    }.bind(this));
}

module.exports = DroneMotorController;