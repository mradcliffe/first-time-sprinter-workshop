'use strict';

const path = require('path');
const webpack = require('webpack');
const base = require('./base');
const defaults = require('./defaults');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = Object.assign({}, base, {
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server',
    './src/js/app',
  ],
  cache: true,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([
      { from: { glob: '*.md' } },
      { from: { glob: 'images/*.*' } },
    ]),
    new webpack.LoaderOptionsPlugin({ debug: true }),
  ],
  module: defaults.getDefaultModules(),
});

config.module.rules.push({
  test: /\.js$/,
  use: ['babel-loader'],
});

module.exports = config;