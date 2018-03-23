const webpack       = require('webpack');
const helpers       = require('./helpers');
const path          = require('path');
const DefinePlugin  = require('webpack/lib/DefinePlugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

const ENV = process.env.ENV = process.env.NODE_ENV = 'unittest';

module.exports = {

  devtool: 'inline-source-map',

  resolve: {
    extensions: [ '.ts', '.js' ],
    modules: [
      helpers.root('app'),
      'node_modules'
    ]
  },

  module: {

    rules: [

      // sourcemap preloader
      {
        test: /\.js$/,
        loaders: [
          'source-map-loader'
        ],
        enforce: 'pre',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular'),
          helpers.root('node_modules/@uirouter/angularjs'),
          helpers.root('node_modules/@uirouter/core')
        ]
      },

      // linting
      {
        test: /\.spec\.ts$/,
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.spec\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: [
          /node_modules/
        ]
      },

      // code
      {
        test: /\.(ts|js)$/,
        loader: 'awesome-typescript-loader',
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

      {
        test: /\.(css|scss)/,
        loaders: [
          'to-string-loader',
          'null-loader'
        ]
      },

      // code instrumentation, post load
      {
        test: /\.(ts|js)$/,
        loader: 'istanbul-instrumenter-loader',
        include: helpers.root('app'),
        exclude: [
          /\.(e2e|spec)\.(ts|js)$/,
          /node_modules/
        ],
        enforce: 'post'
      }
    ]
  },

  plugins: [
    new CheckerPlugin(),

    new DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'IQ_LINK': JSON.stringify(process.env.IQ_LINK),
        'SURVEY_IQ_LINK': JSON.stringify(process.env.SURVEY_IQ_LINK),
        'DEBUG_GOOGLE_ANALYTICS': JSON.stringify(process.env.DEBUG_GOOGLE_ANALYTICS)
      }
    }),

    // https://github.com/angular/angular/issues/11580#issuecomment-327338189
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      helpers.root('app')
    ),

    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,

      options: {
        context: path.resolve(__dirname, './app'),

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
};
