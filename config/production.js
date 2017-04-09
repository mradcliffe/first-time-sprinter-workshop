'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./base');
const defaults = require('./defaults');

const config = Object.assign({}, base, {
  entry: [
    'babel-polyfill',
    path.join(__dirname, '/../src/js/app'),
  ],
  cache: false,
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([
      { from: { glob: '*.md' } },
      { from: { glob: 'images/*.*' } },
    ]),
  ],
  module: defaults.getDefaultModules(),
});

config.module.rules.push({
  test: /\.js$/,
  loader: 'babel-loader',
});

module.exports = config;