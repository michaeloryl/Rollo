/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:48 PM
 */

var Q = require('q');
var async = require('async-q');

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

function loop(params) {
  var count = params[0];
  var lines = params[1];
  var index = 0;

  for (var i = 0; i < count; i++) {
    index++;
    console.log("LOOP " + index + " of " + count + ":");
    console.log("END LOOP " + index + " of " + count + ":");

  }
}

function pointMe(params) {
  return Q.fcall(function () {
    console.log("POINTME:");
  });
}

function waitForTap() {
  var deferred = Q.defer();
  console.log("WAITFORTAP:");
  setTimeout(function () {
    console.log("TAP!");
    deferred.resolve();
  }, 500);

  return deferred.promise;
}

function turnAround() {
  return Q.fcall(function () {
    console.log("TURNAROUND:");
  });
}

function stop() {
  return Q.fcall(function () {
    console.log("STOP:");
  });
}

function go() {
  return Q.fcall(function () {
    console.log("GO:");
  });
}
function setColor(params) {
  var color = params[0];

  if (typeof color === 'string') {
    color = color.toUpperCase();
  }

  return Q.fcall(function () {
    console.log("SETCOLOR:" + color);
  });
}

function flash(params) {
  var color = params[0];

  if (typeof color === 'string') {
    color = color.toUpperCase();
  }

  return Q.fcall(function () {
    console.log("FLASH: " + color);
  });

}
function speed(params) {
  var speed = params[0];
  return Q.fcall(function () {
    console.log("SPEED: " + speed);
  });
}

function turn(params) {
  var degrees = params[0];
  return Q.fcall(function () {
    console.log("TURN: " + degrees);
  });
}

function turnRight(params) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  return Q.fcall(function () {
    console.log("TURNRIGHT: " + degrees);
  });
}

function turnLeft(params) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  return Q.fcall(function () {
    console.log("TURNLEFT: " + degrees);
  });
}

function log(params) {
  return Q.fcall(function () {
    params.forEach(function (param, index, array) {
      console.log("LOG: " + param);
    });
  });
}

function wait(params) {
  var deferred = Q.defer();
  console.log("WAIT: " + param + " second");
  setTimeout(function () {
    console.log("DONE WAITING!");
    deferred.resolve();
  }, params[0] * 1000);

  return deferred.promise;
}

module.exports.executeCmd = executeCmd;

function executeCmd(cmd, params) {
  var deferred = Q.defer();

  //console.log(this);
  if (commands.hasOwnProperty(cmd)) {
    this.cmdCount++;
    commands[cmd].call(this, params).then(deferred.resolve());
  } else {
    this.unknownCmdCount++;
    console.log("Rollo: Unsupported command -> " + cmd);
    deferred.resolve();
  }

  return deferred.promise;
}

module.exports.execute = execute;

function execute(lines) {
  var deferred = Q.defer();

  console.log(JSON.stringify(this));
  async.eachSeries(lines, function(line, index, array) {
    var cmd = line[0];
    var params = line.slice(1);
    console.log(index + ": " + cmd);

    return executeCmd.call(this, cmd, params);
  }).then(function() {
    console.log("ALL DONE ROLLO");
  });
}
