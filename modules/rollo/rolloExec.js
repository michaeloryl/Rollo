/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:48 PM
 */

var async = require('async');
var colors = require('./colors');

var globals = {};

var commands = {
  log: log,
  say: log,
  wait: wait,
  turnRight: turnRight,
  turnLeft: turnLeft,
  turn: turn,
  speed: speed,
  flash: flash,
  color: color,
  go: go,
  stop: stop,
  waitForTap: waitForTap,
  turnAround: turnAround,
  reverse: turnAround,
  pointMe: pointMe,
  loop: loop
};

function loop(params, cb) {
  var count = params[0];
  var lines = params[1];

  async.timesSeries(count, function (n, next) {
    console.log("LOOP: " + (n+1) + " of " + count);
    executeLines(lines, function (err) {
      console.log("LOOP:END");
      return next();
    });
  }, function (err, res) {
    return cb();
  });
}

function pointMe(params, cb) {
  console.log("POINTME:");
  return cb();
}

function waitForTap(params, cb) {
  console.log("WAITFORTAP:");
  setTimeout(function () {
    console.log("TAP!");
    return cb();
  }, 1000);
}

function turnAround(params, cb) {
  console.log("TURNAROUND:");
  return cb();
}

function stop(params, cb) {
  console.log("STOP:");
  return cb();
}

function go(params, cb) {
  console.log("GO:");
  return cb();
}

function color(params, cb) {
  var color = colors.parseColor(params[0]);
  setColor(color);
  console.log("COLOR: " + color);
  return cb();
}

function flash(params, cb) {
  var color = colors.parseColor(params[0]);
  var oldColor = getColor();
  setColor(color);
  setTimeout(function() {
    setColor(oldColor);
  }, 500);

  console.log("FLASH: " + color);
  return cb();
}

function speed(params, cb) {
  var speed = params[0];
  setSpeed(speed);
  console.log("SPEED: " + speed);
  return cb();
}

function turn(params, cb) {
  var degrees = params[0];
  adjustHeading(degrees);
  console.log("TURN: " + degrees);
  return cb();
}

function turnRight(params, cb) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  adjustHeading(degrees);
  console.log("TURNRIGHT: " + degrees);
  return cb();
}

function turnLeft(params, cb) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  adjustHeading(degrees);
  console.log("TURNLEFT: " + degrees);
  return cb();
}

function log(params, cb) {
  params.forEach(function (param, index, array) {
    console.log("LOG: " + param);
  });
  return cb();
}

function wait(params, cb) {
  var count = params[0];

  console.log("WAIT: " + count + " seconds");

  setTimeout(function () {
    console.log("WAIT: DONE");
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

function adjustHeading(heading) {
  if (globals.heading == null) {
    globals.heading = 0;
  }

  globals.heading += heading;

  if (globals.heading > 360) {
    globals.heading -= 360;
  }

  if (globals.heading <0) {
    globals.heading += 360;
  }
}

function setColor(color) {
  if (globals.color == null) {
    globals.color = 0;
  }
  globals.color = color;
}

function getColor() {
  return globals.color || 0x000000;
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
    //console.log("ROLLO: Finished execute() call");
    done();
  });
}

module.exports.execute = execute;

function execute(lines, mySphero, done) {
  if (done == undefined) {
    done = mySphero; // mySphero is optional
  }
  globals = this;
  return executeLines(lines, done);
}
