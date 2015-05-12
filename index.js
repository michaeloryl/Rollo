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

console.log("Args: " + process.argv);

var sourceFile = (process.argv.length < 3 ? 'input.rol' : process.argv[2]);

fs.readFile(sourceFile, 'utf8', main);

function main(err, source) {
  if (err) {
    console.log("Could not read file " + sourceFile);
    console.log("Error: " + err.message);
    return;
  }

  var tree = Rollo.parse(source);

  console.log(JSON.stringify(tree));

  Rollo.execute.call(state, tree);

  console.log("\nRollo: " + state.cmdCount + " commands evaluated, " + state.unknownCmdCount + " unknown commands encountered\n\n");
}

