const path = require('path');

module.exports = {
  entry: './app/app.js',
  mode: 'development',
  devtool: false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  devServer: {
    contentBase: [path.join(__dirname, 'app'), path.join(__dirname, 'dist')]
  }
};
