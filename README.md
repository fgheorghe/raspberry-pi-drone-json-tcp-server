Drone JSON-TCP server.

# Installation Instructions #

Requires ServoBlaster (https://github.com/richardghirst/PiBits/tree/master/ServoBlaster), nodejs and npm: http://weworkweplay.com/play/raspberry-pi-nodejs/

On drone Raspberry Pi issue:

sudo npm install forever -g

npm install

# Configuration #

Edit configuration.ini.

# Usage #

Start daemon: npm start

Stop daemon: npm stop

View running process: forever list