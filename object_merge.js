const path = require('path')

// example of merge 2 object with Object.assign(target, source)
const dev = {
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
  optimization: {
    minimize: false
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    // new webpack.HotModuleReplacementPlugin()
  ]
}

const prod = {
  devtool: 'cheap-source-map',
  mode: 'production',
  optimization: {
    minimize: true
  },
  plugins: ['MyPluginA', 'MyPluginB']
}

console.log(Object.assign(dev, prod))
