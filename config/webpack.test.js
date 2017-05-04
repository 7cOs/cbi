const webpack       = require('webpack');
const helpers       = require('./helpers');
const path          = require('path');
const DefinePlugin  = require('webpack/lib/DefinePlugin');

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
          helpers.root('node_modules/@angular')
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
        loader: 'null-loader'
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
    new DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV)
      }
    }),

    // https://github.com/angular/angular/issues/11580#issuecomment-282705332
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
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
          formatter: 'stylish'
        },

        eslint: {
          failOnWarning: false,
          failOnError: true
        }
      }
    })
  ]
};
