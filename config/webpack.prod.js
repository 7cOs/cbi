const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const cssnano = require('cssnano');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  devtool: false,

  module: {
    rules: [

      // styles which are global (imported through main.scss e.g. all ng1 styles)
      {
        test: /\.(css|scss)/,
        include: [path.resolve(helpers.root('app'), 'main.scss')],
        loader: ExtractTextPlugin.extract([
          'css-loader?-minimize',         // optimization is done in postcss-loader
          'postcss-loader',
          'resolve-url-loader?keepQuery', // resolve url() paths relative to source files
          'sass-loader?sourceMap',
          'import-glob-loader'
        ])
      },

      {
        test: /\.js$/,
        include: helpers.root('app'),
        loader: 'ng-annotate-loader'
      }

    ]
  },

  plugins: [

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.optimize.UglifyJsPlugin(),

    new webpack.DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: false,  // done on a per-loader basis
      debug: false,
      options: {
        context: path.resolve(__dirname, './app'),

        postcss: [
          cssnano({
            sourcemap: false,
            autoprefixer: {
              add: true,
              remove: true
            },
            safe: true,
            mergeLonghand: false, // workaround for angular-material issues
            discardComments: {
              removeAll: true
            }
          })
        ],

        htmlLoader: {
          minimize: false // workaround for ng2
        },

        eslint: {
          failOnWarning: true,
          failOnError: true
        }
      }
    })
  ]
});
