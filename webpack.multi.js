const path = require('path')
const merge = require('webpack-merge')
const colors = require('colors/safe')
const webpack = require('webpack')

class LogOptionPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tap(
      'LogOptionPlugin',
      (_compilation, _callback) => {
        const util = require('util')
        console.log(util.inspect(compiler.options))
      }
    )
  }
}

const baseConfig = {
  mode: 'development',
  entry: './app/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/dist/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}

module.exports = [
  {
    name: 'other',
    mode: 'development',
    entry: './app/app.js',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'app.other.bundle.js',
      publicPath: '/dist/'
    }
  },
  function(env, argv) {
    console.log(colors.green('env=' + env))
    // baseConfig.name = 'base'
    // baseConfig.output.filename = 'app.base.bundle.js'
    const config = merge(baseConfig, {
      name: 'base',
      output: {
        filename: 'app.base.bundle.js'
      },
      plugins: [new LogOptionPlugin()]
    })
    // console.log(config)
    return config
  }
]
