/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:48 PM
 */
var commands = {
  log: log,
  say: log
};

function log(params) {

  params.forEach(function(param, index, array) {
    console.log(param);
  });
}

module.exports.execute = function(cmd, params) {
  if (commands.hasOwnProperty(cmd)) {
    this.cmdCount++;
    commands[cmd].call(this, params);
  } else {
    this.unknownCmdCount++;
    console.log("Rollo: Unsupported command -> " + cmd);
  }
};

