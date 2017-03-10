const webpack       = require('webpack');
const helpers       = require('./helpers');
const path          = require('path');
const DefinePlugin  = require('webpack/lib/DefinePlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'unittest';

module.exports = {

  devtool: 'inline-source-map',

  resolve: {
    extensions: [ '.js' ],
    modules: [
      helpers.root('app'),
      'node_modules'
    ]
  },

  module: {

    rules: [

      // preloaders for linting and sourcemaps
      {
        test: /\.js$/,
        loaders: [
          'source-map-loader',
          'eslint-loader'
        ],
        enforce: 'pre',
        exclude: [
          /node_modules/
        ]
      },

      // code
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      },

      // templates
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.pug$/,
        include: helpers.root('app'),
        loaders: [
          'html-loader?attrs=img:src link:href',
          'pug-html-loader?exports=false'
        ]
      },

      // fonts & images
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader'
      },

      // styles which will be required by JS (ng2 component styles)
      {
        test: /\.(css|scss)/,
        include: [ helpers.root('app') ],
        exclude: [ path.resolve(helpers.root('app'), 'main.scss') ],
        loaders: [
          'exports-loader?module.exports.toString()',
          'css-loader?-minimize&sourceMap',
          'sass-loader?sourceMap'
        ]
      },

      // styles which are global (imported through main.scss e.g. all ng1 styles)
      {
        test: /\.(css|scss)/,
        include: [ path.resolve(helpers.root('app'), 'main.scss') ],
        loaders: [
          'style-loader',
          'css-loader?-minimize&sourceMap',
          'resolve-url-loader?sourceMap&keepQuery',
          'sass-loader?sourceMap',
          'import-glob-loader'
        ]
      },

      // code instrumentation, post load
      {
        test: /\.(js)$/,
        loader: 'istanbul-instrumenter-loader',
        include: helpers.root('app'),
        exclude: [
          /\.(e2e|spec)\.(js)$/,
          /node_modules/
        ],
        enforce: 'post'
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      }
    }),

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('app')
    )
  ]
};
