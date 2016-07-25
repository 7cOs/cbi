'use strict';

module.exports = function(app) {

  var redis = require('redis');
  var requestProxy = require('express-request-proxy');
  require('redis-streams')(redis);

  // RENDER ALL PAGES TO APP VIEW
  app.get('/', function (req, res) {
    res.render('main', {
      config: app.get('config')
    });
  });

  app.get('/api/:resource', requestProxy({
    cache: redis.createClient(),
    cacheMaxAge: 60,
    url: "http://jsonplaceholder.typicode.com/:resource"
  }));

};
