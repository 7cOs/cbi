const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SassLintPlugin    = require('sasslint-webpack-plugin');
const path              = require('path');
const helpers           = require('./helpers');

module.exports = {
  entry: {
    'app': './app/main.js'
  },

  output: {
    path: helpers.root('public'),
    publicPath: '/',
    filename: 'app/[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  resolve: {
    extensions: [ '.js' ],
    modules: [
      helpers.root('app'),
      'node_modules'
    ]
  },

  module: {

    rules: [
      // pre-loaders, for linting
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

      // non-font images
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        include: [ helpers.root('app') ],
        exclude: [ helpers.root('app/assets/fonts') ],
        loaders: [
          'url-loader?limit=1024&name=assets/img/[name].[hash].[ext]',
          'image-webpack-loader'
        ]
      },
      {
        test: /\.svg$/,
        include: [ helpers.root('app') ],
        exclude: [ helpers.root('app/assets/fonts') ],
        loaders: [
          'file-loader?name=assets/img/[name].[hash].[ext]',
          'image-webpack-loader'
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
      // name: [ 'app', 'polyfills' ]
      name: [ 'app' ]
    }),

    new HtmlWebpackPlugin({
      filename: 'app/index.html',
      template: 'app/main.pug'
    }),

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('app')
    )
  ]
};
