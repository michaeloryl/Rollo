/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:48 PM
 */
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
  console.log("POINTME:");
}

function waitForTap() {
  console.log("WAITFORTAP:");
}

function turnAround() {
  console.log("TURNAROUND:");
}

function stop() {
  console.log("STOP:");
}

function go() {
  console.log("GO:");
}
function setColor(params) {
  var color = params[0];

  if (typeof color === 'string') {
    color = color.toUpperCase();
  }

  console.log("SETCOLOR: " + color);
}

function flash(params) {
  var color = params[0];

  if (typeof color === 'string') {
    color = color.toUpperCase();
  }

  console.log("FLASH: " + color);
}
function speed(params) {
  var speed = params[0];
  console.log("SPEED: " + speed);
}

function turn(params) {
  var degrees = params[0];
  console.log("TURN: " + degrees);
}

function turnRight(params) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  console.log("TURNRIGHT: " + degrees);
}

function turnLeft(params) {
  var degrees = 90;

  if (params.length > 0) {
    degrees = params[0];
  }

  console.log("TURNLEFT: " + degrees);
}

function log(params) {
  params.forEach(function (param, index, array) {
    console.log("LOG: " + param);
  });
}

function wait(params) {
  params.forEach(function (param, index, array) {
    console.log("WAIT: " + param + " second");
  });
}

module.exports.executeCmd = executeCmd;

function executeCmd(cmd, params) {
  //console.log(this);
  if (commands.hasOwnProperty(cmd)) {
    this.cmdCount++;
    commands[cmd].call(this, params);
  } else {
    this.unknownCmdCount++;
    console.log("Rollo: Unsupported command -> " + cmd);
  }
}

module.exports.execute = execute;

function execute(lines) {
  console.log(JSON.stringify(this));
  lines.forEach(function (line, index, array) {
    var cmd = line[0];
    var params = line.slice(1);

    executeCmd.call(this, cmd, params);
  });
}
