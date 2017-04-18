const path = require('path');

const srcPath = path.join(__dirname, '/../src/');

function getDefaultModules() {
  return {
    rules: [
      { parser: { amd: false } },
      {
        test: /\.js$/,
        include: srcPath,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: { outputStyle: 'expanded' }
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[name].[ext]',
        },
      },
      {
        test: /\.woff(\?v=0-9]\.[0-9]\.[0-9])?/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.woff(2)(\?v=0-9]\.[0-9]\.[0-9])?/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff2',
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=0-9]\.[0-9]\.[0-9])?/,
        loader: 'file-loader',
        exclude: [
          path.resolve(__dirname, '../images/'),
        ],
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.(svg|png|jpg)(\?v=0-9]\.[0-9]\.[0-0])?/,
        loader: 'file-loader',
        include: [
          path.resolve(__dirname, '../images/'),
        ],
        options: {
          name: 'images/[name].[ext]',
        },
      },
    ],
  };
};

module.exports = {
  srcPath: srcPath,
  publicPath: '',
  port: 8000,
  getDefaultModules: getDefaultModules,
  postcss: () => ([])
};
