/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:12 PM
 */
var Rollo = require('./modules/rollo');
var fs = require('fs');

var state = {
  sphero: null,
  speed: 0,
  defaultSpeed: 50,
  heading: 0,
  cmdCount: 0,
  unknownCmdCount: 0
};

module.exports.main = function(my) {
  state.sphero = my.sphero;
  var sourceFile = (process.argv.length < 3 ? 'input.rol' : process.argv[2]);

  fs.readFile(sourceFile, 'utf8', function(err, source) {
    if (err) {
      console.log("Could not read file " + sourceFile);
      console.log("Error: " + err.message);
      return;
    }

    console.log("\n\n");

    var tree = Rollo.parse(source);

    Rollo.execute.call(state, tree, my.sphero, function() {
      console.log("\n\nROLLO: " + state.cmdCount + " commands evaluated, " + state.unknownCmdCount + " unknown commands encountered");
      console.log("ROLLO: Shutting down");
      process.exit(0);
    });
  });
};

