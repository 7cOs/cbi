const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SassLintPlugin    = require('sasslint-webpack-plugin');
const path              = require('path');
const helpers           = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './app/polyfills.ts',
    'app': './app/main.ts'
  },

  output: {
    path: helpers.root('public'),
    publicPath: '/',
    filename: 'app/[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  resolve: {
    extensions: [ '.ts', '.js' ],
    modules: [
      helpers.root('app'),
      'node_modules'
    ]
  },

  module: {

    rules: [
      // pre-loaders, for linting
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.js$/,
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

      // non-font images
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        include: [ helpers.root('app') ],
        exclude: [ helpers.root('app/assets/fonts') ],
        loaders: [
          'url-loader?limit=1024&name=assets/img/[name].[hash].[ext]',
          'image-webpack-loader?bypassOnDebug=false'
        ]
      },
      {
        test: /\.svg$/,
        include: [ helpers.root('app') ],
        exclude: [ helpers.root('app/assets/fonts') ],
        loaders: [
          'url-loader?limit=8192&mimetype=image/svg+xml&name=assets/img/[name].[hash].[ext]',
          'image-webpack-loader?bypassOnDebug=false'
        ]
      },

      // fonts
      {
        test: /\.(woff2?|ttf|eot)$/,
        include: [ helpers.root('app/assets/fonts') ],
        loaders: [ 'url-loader?limit=1024&name=assets/fonts/[name].[hash].[ext]' ]
      },
      {
        test: /\.svg$/,
        include: [ helpers.root('app/assets/fonts') ],
        loaders: [ 'file-loader?name=assets/fonts/[name].[hash].[ext]' ]
      },

      // styles which will be required by JS (ng2 component styles)
      {
        test: /\.(css|scss)/,
        include: [ helpers.root('app') ],
        exclude: [ path.resolve(helpers.root('app'), 'main.scss') ],
        loaders: [
          'exports-loader?module.exports.toString()',
          'css-loader?-minimize',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [

    new ExtractTextPlugin('app/[name].[hash].css'),

    new SassLintPlugin({
      ignorePlugins: ['extract-text-webpack-plugin'],
      failOnWarning: false,
      failOnError: false
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: [ 'app', 'polyfills' ]
    }),

    new HtmlWebpackPlugin({
      filename: 'app/index.html',
      template: 'app/main.pug'
    }),

    // https://github.com/angular/angular/issues/11580#issuecomment-282705332
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('app')
    )
  ]
};
