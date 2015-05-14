/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/13/15
 * Time: 7:01 PM
 */
var Cylon = require('cylon');
var main = require('./index').main;

Cylon.robot({
  connections: {
    sphero: {adaptor: 'sphero', port: '/dev/tty.Sphero-ROB-AMP-SPP'}
  },

  devices: {
    sphero: {driver: 'sphero'}
  },

  work: main

}).start();

