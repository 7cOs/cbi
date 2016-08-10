'use strict';

module.exports =
  function timeAgo($filter) {
    /**
     * @name timeAgo
     * @desc calculate how much time has gone by since the update
     * @params {String} displayDate - date string to be converted
     * @params {String} type - type of date - possible options are 'relative', 'relativeTime' and 'daysOnly'
     * @returns {String} - returns how many days, months, or years it has been since the displayDate
     * @memberOf orion.common.filters
     */
    return function(displayDate, type) {
      var currentDate = new Date(),
          d = new Date(displayDate),
          returnStr = '';

      if (type === 'daysOnly') {
        var hoursPast = Math.round((currentDate - d) / (1000 * 60 * 60));

        if (hoursPast < 2) returnStr = hoursPast + ' hour ago';
        else if (hoursPast < 25) returnStr = hoursPast + ' hours ago';
        else if (hoursPast > 24) returnStr = Math.round(hoursPast / 24) + ' days ago';

      } else if (type === 'relative' || type === 'relativeTime') {
        var daysAgo = (currentDate - d) / (1000 * 60 * 60 * 24);

        if (daysAgo > 7) { // 7+ days
          returnStr = type === 'relativeTime' ? $filter('date')(d, 'MMMM d, y') + ' at ' + $filter('date')(d, 'h:mm a') : $filter('date')(d, 'longDate');
        } else if (daysAgo > 1) { // 1 - 7 days
          returnStr = Math.round(daysAgo) + ' days ago';
        } else if (daysAgo < 1 && (daysAgo * 24) > 1) { // 61 minutes to 24 hours
          var hours = Math.round(daysAgo * 24);
          returnStr = hours < 2 ? hours + ' hour ago' : hours + ' hours ago';
        } else { // 0-60 minutes
          var minutes = Math.round(daysAgo * 24 * 60);
          returnStr = minutes < 2 ? minutes + ' minute ago' : minutes + ' minutes ago';
        }
      }

      return returnStr;
    };
  };
