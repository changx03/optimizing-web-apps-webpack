const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.gen\.js$/,
        loader: 'codegen-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'codegen-loader': path.resolve(__dirname, '../loaders/codegen-loader.js')
    }
  }
}
