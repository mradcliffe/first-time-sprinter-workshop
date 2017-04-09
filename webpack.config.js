'use strict';

const path = require('path');
const args = require('minimist')(process.argv.slice(2));

// List of allowed environments.
const allowedEnvs = ['dev', 'production'];

// Set the correct environment.
let env;
if (args._.length > 0 && args._.indexOf('start') !== -1) {
  env = 'test';
} else if (args.env) {
  env = args.env;
} else {
  env = 'dev';
}

/**
 * Build the webpack configuration.
 *
 * @param {String} env The provided environment
 * @return {Object} Webpack config.
 */
function buildConfig(env) {
  let isValid = env && env.length > 0 && allowedEnvs.indexOf(env) !== -1;
  let validEnv = isValid ? env : 'dev';
  let config = require(path.join(__dirname, 'config/' + validEnv));
  return config;
}

module.exports = buildConfig(env);
