'use strict';

module.exports =
  function timeAgo() {
    /**
     * @name timeAgo
     * @desc calculate how much time has gone by since the update
     * @params {String} displayDate - date string to be converted
     * @returns {String} - returns how many days, months, or years it has been since the displayDate
     * @memberOf andromeda.common.services
     */
    return function(displayDate) {
      console.log('i am found');
      var currentDate = new Date(),
          d = new Date(displayDate),
          returnStr = '';

      var daysPast = Math.round((currentDate - d) / (1000 * 60 * 60 * 24));

      if (daysPast < 30) { // under 30 days, round to days
        returnStr = daysPast + ' days ago';
      } else if (daysPast < 365) { // less than 365 days, round to month
        returnStr = Math.round(daysPast / 30);
        returnStr += returnStr === 1 ? ' month ago' : ' months ago';
      } else { // more than a year, round to year
        returnStr = Math.round(daysPast / 365);
        returnStr += returnStr === 1 ? ' year ago' : ' years ago';
      }

      return returnStr;
    };
  };
