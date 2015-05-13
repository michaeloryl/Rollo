/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/12/15
 * Time: 10:29 PM
 */
var async = require('async');

function iterator(number, callback) {
  setTimeout(function () {
    console.log(number);
    callback(); // Alternatively: callback(new Error());
  }, number * 100);
}

function done(err) {
  if (err) {
    throw err;
  }
  console.log('Done eachSeries');
}

async.timesSeries(2, function (n, next) {
  async.eachSeries([2, 3, 5, 7, 11], iterator, next);
}, function (err, res) {
  console.log("Done timesSeries");
});
