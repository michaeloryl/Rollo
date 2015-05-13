/**
 * Created with IntelliJ IDEA.
 * User: mfo
 * Date: 5/12/15
 * Time: 11:24 PM
 */

module.exports.parseColor = function(color) {
  if (typeof color === 'string') {
    return parseColorString(color.toLocaleLowerCase());
  } else {
    return color;
  }
};

function parseColorString(color) {
  var colors = {
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    orange: 0xffa500,
    purple: 0x800080,
    white: 0xffffff,
    yellow: 0xffff00,
    none: 0x000000,
    off: 0x000000
  };

  if (colors.hasOwnProperty(color)) {
    return colors[color];
  } else {
    return 0x000000;
  }
}
