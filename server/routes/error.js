// NOTE: THIS ROUTE MUST BE LOADED LAST

'use strict';

module.exports = function(app) {

  const controller = app.get('controller')();

  // 404 PAGE
  app.get('*', function (req, res) {
    controller.get('error/404');
  });

};
