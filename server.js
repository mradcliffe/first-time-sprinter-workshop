'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

new WebpackDevServer(webpack(config), config.devServer)
  .listen(config.devServer.port, 'localhost', (err) => {
    const url = 'http://localhost:' + config.devServer.port;
    if (err) {
      console.error(err);
    }
    open(url);
  });