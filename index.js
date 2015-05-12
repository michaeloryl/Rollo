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

  var tree = Rollo.language.parse(source);

  tree.forEach(function(line, index, array) {
    var cmd = line[0];
    var params = line.slice(1);

    console.log("\n" + cmd + ":");
    if (params.length > 0) {
      console.log("\t" + JSON.stringify(params));
    }

    Rollo.execute.call(state, cmd, params);

  });

  console.log("Rollo: " + state.cmdCount + " commands evaluated, " + state.unknownCmdCount + " unknown commands encountered");
}

