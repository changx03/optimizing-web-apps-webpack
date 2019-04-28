const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)|(bower_components)/,
        use: [
          { loader: 'tee-loader', options: { label: 'after' } },
          'babel-loader'
        ]
      }
    ]
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  },
  resolve: {
    alias: {
      'tee-loader': path.resolve(__dirname, 'loader', 'tee-loader')
    }
  }
}
