'use strict';

module.exports = {

  // APPLY TITLE CASING
  titleCase: function(str) {
    var newstr = str.split(' ');
    for (let i = 0; i < newstr.length; i++) {
      let copy = newstr[i].substring(1).toLowerCase();
      newstr[i] = newstr[i][0].toUpperCase() + copy;
    }
    return newstr.join(' ');
  }

};
