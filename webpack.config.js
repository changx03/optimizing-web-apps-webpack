const path = require('path')
const webpack = require('webpack')
const colors = require('colors/safe')
const merge = require('webpack-merge')

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
  optimization: {
    minimize: false
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
  ]
}

if (isDev) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = merge(config, {
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV_MODE: isDev,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    })
  ]
})
