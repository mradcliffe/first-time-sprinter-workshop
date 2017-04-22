'use strict';

const path = require('path');
const defaults = require('./defaults');

module.exports = {
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/../www/'),
    filename: 'js/app.js',
    publicPath: defaults.publicPath,
  },
  devServer: {
    contentBase: './www/',
    historyApiFallback: true,
    hot: true,
    port: 8000,
    publicPath: defaults.publicPath,
    noInfo: false,
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {},
};