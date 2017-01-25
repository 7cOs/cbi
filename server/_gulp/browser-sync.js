(function() {
  var browserSync, config, gulp, reload;
  browserSync = require('browser-sync');
  config = require('../../server/_config/app');
  gulp = require('gulp');
  reload = browserSync.reload;

  gulp.task('browserSync', function() {
    return browserSync.init(null, {
      files: config.gulp.browserSync.files,
      open: config.gulp.browserSync.open,
      port: config.gulp.browserSync.port,
      proxy: {
        target: 'http://localhost:' + config.port,
        proxyReq: [
          function(proxyReq) {
            // fix browsersync proxy's behavior of changing accept header for IE<9 (compatibility mode sets 7)
            // https://github.com/BrowserSync/browser-sync/issues/366
            // https://github.com/shakyShane/foxy/blob/b487c91dd559c431dc2e6c7ee85851927445fd91/lib/utils.js#L169-L194
            if (/^\/api\//.test(proxyReq.path) && proxyReq['_headers'].accept === 'text/html') {
              proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
              proxyReq.setHeader('Accept-Encoding', 'gzip, deflate');
            }
          }
        ]
      },
      reloadDelay: config.gulp.browserSync.reloadDelay,
      ws: config.socket,
      watchOptions: {
        ignoreInitial: true,
        ignored: config.gulp.browserSync.ignore
      }
    });
  });

  gulp.task('reload', function() {
    return reload();
  });

}).call(this);
