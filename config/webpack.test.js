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

      // preloaders for linting and sourcemaps
      // {
      //   test: /\.ts$/,
      //   loader: 'tslint-loader',
      //   enforce: 'pre',
      //   exclude: [ helpers.root('node_modules') ]
      // },
      {
        test: /\.js$/,
        loaders: [
          'source-map-loader',
          'eslint-loader'
        ],
        enforce: 'pre',
        exclude: [
          helpers.root('node_modules'),

          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular')
        ]
      },

      // code
      // {
      //   test: /\.ts$/,
      //   use: [
      //     {
      //       loader: 'awesome-typescript-loader',
      //       query: {
      //         configFileName: 'tsconfig.test.json',
      //         compilerOptions: {
      //           removeComments: true
      //         }
      //       }
      //     },
      //     { loader: 'angular2-template-loader' },
      //     { loader: 'angular2-router-loader' }
      //   ],
      //   exclude: [ helpers.root('node_modules') ]
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
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
          // 'pug-html-loader?exports=false&doctype=html'
          'pug-html-loader?exports=false'
        ]
      },

      // fonts & images
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader'
      },

      // styles which will be referenced by JS (ng2 component styles)
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

      // styles which are global or not referenced by JS framework (all ng1 styles)
      {
        test: /\.(css|scss)/,
        include: [ path.resolve(helpers.root('app'), 'main.scss') ],
        loaders: [
          'style-loader',
          'css-loader?-minimize&sourceMap',
          'sass-loader?sourceMap',
          'import-glob-loader'
        ]
      },

      // code instrumentation, post load
      {
        test: /\.(js|ts)$/,
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

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('app')
    )
  ]
};
