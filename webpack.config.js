const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './app/app.js',
  mode: 'development',
  devtool: false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/dist/'
  },
  devServer: {
    contentBase: [path.join(__dirname, 'app'), path.join(__dirname, 'dist')],
    // publicPath: '/dist/',
    watchContentBase: false, // watch files served by the contentBase 
    // hot: true // use with HotModuleReplacementPlugin
    hotOnly: true
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
