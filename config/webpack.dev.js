const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const cssnano = require('cssnano');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

module.exports = webpackMerge(commonConfig, {

  devtool: 'inline-source-map',

  module: {

    rules: [

      // styles which are global or not referenced by JS framework (all ng1 styles)
      {
        test: /\.(css|scss)/,
        include: [ path.resolve(helpers.root('app'), 'main.scss') ],
        loader: ExtractTextPlugin.extract([
          'css-loader?-minimize&sourceMap',  // sourcemaps enabled for Dev
          // 'postcss-loader',               // disable for speed in Dev
          'sass-loader?sourceMap',           // sourcemaps enabled for Dev
          'import-glob-loader'
        ])
      }
    ]
  },

  plugins: [

    new webpack.DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
      options: {
        context: path.resolve(__dirname, './app'),

        postcss: [
          cssnano({
            sourcemap: true, // sourcemap for dev
            autoprefixer: {
              add: true,
              remove: true
            },
            safe: true,

            // faster for dev
            core: false,
            discardComments: false,
            mergeLonghand: false
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
          failOnWarning: false,
          failOnError: true
        }
      }
    })
  ]
});
