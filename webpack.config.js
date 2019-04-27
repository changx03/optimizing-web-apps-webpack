const path = require('path')
const webpack = require('webpack')
const colors = require('colors/safe')

const isDev = process.env.NODE_ENV === 'development'
console.log(colors.green('NODE_ENV=' + process.env.NODE_ENV))

const config = {
  entry: './app/app.js',
  mode: isDev ? 'development' : 'production',
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
    // new webpack.HotModuleReplacementPlugin()
  ]
}

if (isDev) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
