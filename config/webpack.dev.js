const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const cssnano = require('cssnano');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV;

dotenv.config();

module.exports = webpackMerge(commonConfig, {

  devtool: 'inline-source-map',

  module: {

    rules: [

      // styles which are global (imported through main.scss e.g. all ng1 styles)
      {
        test: /\.(css|scss)/,
        include: [ path.resolve(helpers.root('app'), 'main.scss') ],
        loader: ExtractTextPlugin.extract([
          'css-loader?-minimize&sourceMap',         // sourcemaps enabled for Dev
          // 'postcss-loader',                      // disable for speed in Dev
          'resolve-url-loader?sourceMap&keepQuery', // resolve url() paths relative to source files
          'sass-loader?sourceMap',                  // sourcemaps enabled for Dev
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
        'NODE_ENV': JSON.stringify(ENV),
        'IQ_LINK': JSON.stringify(process.env.IQ_LINK),
        'SURVEY_IQ_LINK': JSON.stringify(process.env.SURVEY_IQ_LINK),
        'DEBUG_GOOGLE_ANALYTICS': JSON.stringify(process.env.DEBUG_GOOGLE_ANALYTICS)
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
          formatter: 'stylish',
          // this will deactivate tslint rules that rely on type checking, but is much faster,
          // and we are still linting with type-checking enabled in CI (npm run lint:ts)
          typeCheck: false
        },

        eslint: {
          failOnWarning: true,
          failOnError: true
        }
      }
    })
  ]
});
