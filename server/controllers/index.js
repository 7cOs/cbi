'use strict';

module.exports = (app, client) => {
  client.send.render('index', {
    config: app.get('config')
  });
};
