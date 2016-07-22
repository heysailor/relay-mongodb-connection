module.exports = {
  entry: './index.js',
  output: {
    path: './lib',
    filename: 'index.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  target: 'node',
};
