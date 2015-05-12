/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:48 PM
 */

var async = require('async');

var commands = {
  log: log,
  say: log,
  wait: wait,
  turnRight: turnRight,
  turnLeft: turnLeft,
  turn: turn,
  speed: speed,
  flash: flash,
  setColor: setColor,
  color: setColor,
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
  var index = 0;

  for (var i = 0; i < count; i++) {
    index++;
    console.log("LOOP " + index + " of " + count + ":");
    for (var j = 0; j < lines.length; j++) {
      console.log("==> " + lines[j][0] + " " + lines[j][1]);
    }
    console.log("END LOOP " + index + " of " + count + ":");
  }
  return cb();
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

function setColor(params, cb) {
  var color = params[0];

  if (typeof color === 'string') {
    color = color.toUpperCase();
  }

  console.log("SETCOLOR: " + color);
  return cb();
}

function flash(params, cb) {
  var color = params[0];

  if (typeof color === 'string') {
    color = color.toUpperCase();
  }

  console.log("FLASH: " + color);
  return cb();
}

function speed(params, cb) {
  var speed = params[0];
  console.log("SPEED: " + speed);
  return cb();
}

function turn(params, cb) {
  var degrees = params[0];
  console.log("TURN: " + degrees);
  return cb();
}

function turnRight(params, cb) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  console.log("TURNRIGHT: " + degrees);
  return cb();
}

function turnLeft(params, cb) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

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

module.exports.executeCmd = executeCmd;

function executeCmd(cmd, params, callback) {
  //console.log(this);
  if (commands.hasOwnProperty(cmd)) {
    this.cmdCount++;
    return commands[cmd].call(this, params, callback);
  } else {
    this.unknownCmdCount++;
    console.log("Rollo: Unsupported command -> " + cmd);
    return callback();
  }
}

module.exports.execute = execute;

function execute(lines, done) {
  console.log(JSON.stringify(this));
  async.eachSeries(lines, function (line, callback) {
    var cmd = line[0];
    var params = line.slice(1);

    executeCmd.call(this, cmd, params, callback);
  }, done());
}
