'use strict';

module.exports = function(app, client) {
  client.send.render('errors/500', {
    config: app.get('config'),
    error: {
      code: 500,
      title: 'Server Error!',
      message: 'An an unknown error has occurred. Please try again.'
    }
  });
};
