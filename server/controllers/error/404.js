'use strict';

module.exports = function(app, client) {
  client.send.render('errors/404', {
    config: app.get('config')
  });
};
