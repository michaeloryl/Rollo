/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/11/15
 * Time: 8:12 PM
 */
var Rollo = require('./modules/rollo');
var fs = require('fs');

var state = {
  speed: 0,
  heading: 0,
  cmdCount: 0,
  unknownCmdCount: 0
};

var sourceFile = (process.argv.length < 3 ? 'input.rol' : process.argv[2]);

fs.readFile(sourceFile, 'utf8', main);

function main(err, source) {
  if (err) {
    console.log("Could not read file " + sourceFile);
    console.log("Error: " + err.message);
    return;
  }

  console.log("\n\n");

  var tree = Rollo.parse(source);

  Rollo.execute.call(state, tree, function() {
    console.log("ROLLO: " + state.cmdCount + " commands evaluated, " + state.unknownCmdCount + " unknown commands encountered");
  });

}

