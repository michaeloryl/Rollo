/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:48 PM
 */

var async = require('async');
var colors = require('./colors');
var events = require('../events');

var globals = {};
var TOPIC_COLLISION = 'collision';

var commands = {
  log: log,
  say: log,
  wait: wait,
  turnRight: turnRight,
  right: turnRight,
  turnLeft: turnLeft,
  left: turnLeft,
  turn: turn,
  speed: speed,
  flash: flash,
  color: color,
  go: go,
  stop: stop,
  stopFast: stopFast,
  waitForTap: waitForTap,
  waitForHit: waitForTap,
  turnAround: turnAround,
  reverse: turnAround,
  pointMe: pointMe,
  loop: repeat,
  repeat: repeat
};

/*
 * REPEAT
 */
function repeat(params, cb) {
  var count = params[0];
  var lines = params[1];

  async.timesSeries(count, function (n, next) {
    console.log("repeat: " + (n + 1) + " of " + count);
    executeLines(lines, function (err) {
      console.log("repeat: end");
      return next();
    });
  }, function (err, res) {
    return cb();
  });
}

/*
 * POINT ME
 */
function pointMe(params, cb) {
  console.log("pointMe:");
  return cb();
}

/*
 * WAIT FOR TAP
 */
function waitForTap(params, cb) {
  console.log("waitForTap:");

  var topic = events.subscribe(TOPIC_COLLISION, function () {
    console.log("TAP!");
    topic.remove(); // no longer listen once we catch one collision
    return cb();
  });
}

/*
 * TURN AROUND
 */
function turnAround(params, cb) {
  adjustHeading(180);
  console.log("turnAround:");
  return cb();
}

/*
 * STOP
 */
function stop(params, cb) {
  console.log("stop:");

  setSpeed(0);

  if (sphero()) {
    sphero().roll(0, globals.heading)
  }
  return cb();
}

/*
 * STOP FAST
 */
function stopFast(params, cb) {
  console.log("stopFast:");

  setSpeed(0);

  if (sphero()) {
    sphero().stop();
  }
  return cb();
}

/*
 * GO
 */
function go(params, cb) {
  console.log("go: speed=" + getDefaultSpeed() + " heading=" + globals.heading);
  if (sphero()) {
    sphero().roll(getDefaultSpeed(), globals.heading)
  }

  setSpeed(getDefaultSpeed());

  if (params[0]) {
    var count = params[0];

    setTimeout(function () {
      console.log("go: done");
      setSpeed(0);
      sphero().roll(0, globals.heading);
      return cb();
    }, count * 1000);
  } else {
    return cb();
  }
}

/*
 * COLOR
 */
function color(params, cb) {
  var color = colors.parseColor(params[0]);
  setColor(color);
  console.log("color: " + color);
  return cb();
}

/*
 * FLASH
 */
function flash(params, cb) {
  var color = colors.parseColor(params[0]);
  var oldColor = getColor();
  setColor(color);
  setTimeout(function () {
    setColor(oldColor);
  }, 500);

  console.log("flash: " + color);
  return cb();
}

/*
 * SPEED
 */
function speed(params, cb) {
  var speed = params[0];
  setDefaultSpeed(Math.floor(255 * speed / 100)); // speed is a percentage of max, 255 being max
  console.log("speed: " + speed);
  return cb();
}

/*
 * TURN
 */
function turn(params, cb) {
  var degrees = params[0];
  adjustHeading(degrees);
  console.log("turn: " + degrees);
  return cb();
}

/*
 * TURN RIGHT
 */
function turnRight(params, cb) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  adjustHeading(degrees);
  console.log("turnRight: " + degrees);
  return cb();
}

/*
 * TURN LEFT
 */
function turnLeft(params, cb) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  adjustHeading(-degrees);
  console.log("turnLeft: " + degrees);
  return cb();
}

/*
 * LOG / SAY
 */
function log(params, cb) {
  params.forEach(function (param, index, array) {
    console.log("say: " + param);
  });
  return cb();
}

/*
 * WAIT
 */
function wait(params, cb) {
  var count = params[0];

  console.log("wait: " + count + " seconds");

  setTimeout(function () {
    console.log("wait: done");
    return cb();
  }, count * 1000);
}

// -------- Commands to adjust Sphero features and globals

function setSpeed(speed) {
  if (globals.speed == null) {
    globals.speed = 0;
  }
  globals.speed = speed;
}

function getSpeed() {
  return globals.speed;
}

function setDefaultSpeed(speed) {
  if (globals.defaultSpeed == null) {
    globals.defaultSpeed = 0;
  }
  globals.defaultSpeed = speed;
}

function getDefaultSpeed() {
  return globals.defaultSpeed;
}

function adjustHeading(heading) {
  if (globals.heading == null) {
    globals.heading = 0;
  }

  globals.heading += heading;

  if (globals.heading > 359) {
    globals.heading -= 360;
  }

  if (globals.heading < 0) {
    globals.heading += 360;
  }

  if (sphero()) { // maybe this will actually turn us if we're not moving
    sphero().roll(globals.speed, globals.heading)
  }
}

function setColor(color) {
  if (globals.color == null) {
    globals.color = 0;
  }
  globals.color = color;

  if (sphero()) {
    sphero().setColor(color);
  }
}

function getColor() {
  return globals.color || 0x000000;
}

function sphero() {
  return globals.sphero;
}

function collisionHandler(data) {
  console.log('Collision detected');
  events.publish(TOPIC_COLLISION, convertCollisionData(data.DATA));
}

function convertCollisionData(data) {
  var obj = {};

  obj.xImpact = convertToSignedInt(data[7], data[8]);
  obj.yImpact = convertToSignedInt(data[9], data[10]);
  obj.speed = data[11];

  return obj;
}

function convertToSignedInt(msb, lsb) {
  var negative = msb > 128;
  if (negative) {
    msb -= 128;
  }
  var value = msb*256 + lsb;
  if (negative) {
    value = 0 - value;
  }
  return value;
}

// -------- parse and execute lines of Rollo code

function executeLine(line, callback) {
  var cmd = line[0];
  var params = line.slice(1);
  if (commands.hasOwnProperty(cmd)) {
    globals.cmdCount++;
    return commands[cmd].call(this, params, callback);
  } else {
    globals.unknownCmdCount++;
    console.log("Rollo: Unsupported command -> " + cmd);
    return callback();
  }
}

function executeLines(lines, done) {
  async.eachSeries(lines, executeLine, function (err) {
    done();
  });
}

module.exports.execute = execute;

function execute(lines, mySphero, done) {
  console.log(JSON.stringify(lines));
  if (done == undefined) {
    done = mySphero; // mySphero is optional
  }
  globals = this;
  if (sphero()) {
    adjustHeading(0);
    sphero().configureCollisionDetection(0x01, 0x40, 0x40, 0x40, 0x40, 0x50); // defaults: 0x01, 0x40, 0x40, 0x50, 0x50, 0x50
    sphero().on("collision", collisionHandler)
  }
  return executeLines(lines, done);
}
