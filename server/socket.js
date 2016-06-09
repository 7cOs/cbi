'use strict';

module.exports = function(app) {

  const config = app.get('config');
  const io = require('socket.io')(app.server);
  const namespace = io.of('/' + config.namespace);

  // CONNECTION
  namespace.on('connection', function(namespace) {

    const id = namespace.id;

    console.log('connected with id ' + id);

    // TELL CLIENT WE'RE CONNECTED
    namespace.emit('connected', {
      connected: true,
      id: id,
      session: app.get('sessionID')
    });

    // ERROR HANDLER
    namespace.on('error', function(err) {

      console.error('Socket Error:', err.message);

      // io.to(config.namespace).emit('error', {
      namespace.emit('error', {
        err: err.message
      });

    });

    // HANDLE DISCONNECTIONS
    namespace.on('disconnect', function(namespace) {
      console.log('USER DISCONNECTED!');
      console.log(id + ' disconnected');
    });

  });

};
