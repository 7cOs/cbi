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
      // styles which are global or not referenced by JS framework (all ng1 styles)
      {
        test: /\.(css|scss)/,
        include: [path.resolve(helpers.root('app'), 'main.scss')],
        loader: ExtractTextPlugin.extract([
          'css-loader?-minimize', // optimization is done in postcss-loader
          'postcss-loader',
          'sass-loader',
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
            discardComments: {
              removeAll: true
            }
          })
        ],

        htmlLoader: {
          minimize: false // workaround for ng2
        },

        tslint: {
          emitErrors: false,
          failOnHint: true,
          formatter: 'stylish'
        },

        eslint: {
          failOnWarning: true,
          failOnError: true
        }
      }
    })
  ]
});
