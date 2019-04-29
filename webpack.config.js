const path = require('path')
const webpack = require('webpack')
const colors = require('colors/safe')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const babelLoader = require('./config/babelloader')
const codegenLoader = require('./config/codegenloader')

const isDev = process.env.NODE_ENV === 'development'
console.log(colors.green('NODE_ENV=' + process.env.NODE_ENV))

let config = {
  entry: './app/app.js',
  mode: isDev ? 'development' : 'production',
  devtool: false, //'cheap-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/dist/'
  },
  optimization: {
    minimize: false
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin() // <PROJECT_DIR>/dist/ is the default
  ]
}

if (isDev) {
  // config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config = merge(config, {
    devServer: {
      contentBase: [path.join(__dirname, 'app'), path.join(__dirname, 'dist')],
      publicPath: '/dist/',
      watchContentBase: false, // watch files served by the contentBase
      // hot: true // use with HotModuleReplacementPlugin
      hotOnly: true,
      overlay: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  })
}

module.exports = merge(config, babelLoader, codegenLoader, {
  plugins: [
    new webpack.DefinePlugin({
      ENV_IS_DEVELOPMENT: isDev,
      ENV_IS: JSON.stringify(process.env.NODE_ENV)
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[name].map',
    //   noSources: false
    // })
  ]
})
