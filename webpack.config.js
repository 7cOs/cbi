switch (process.env.NODE_ENV) {
  case 'production':
  case 'stage':
  case 'loadtest':
  case 'test':
  case 'development':
    module.exports = require('./config/webpack.prod');
    break;
  case 'unittest':
    module.exports = require('./config/webpack.test');
    break;
  case 'local':
  default:
    process.env.NODE_ENV = 'local';
    module.exports = require('./config/webpack.dev');
}
