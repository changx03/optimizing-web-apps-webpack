const path = require('path')
const webpack = require('webpack')
const colors = require('colors/safe')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const babelLoader = require('./config/babelloader')
const codegenLoader = require('./config/codegenloader')

module.exports = function(env, argv) {
  const isProduction = env.production || process.env.NODE_ENV === "production";
  console.log(
    colors.green("mode=" + (isProduction ? "production" : "development"))
  );

  let config = {
    entry: "./app/app.js",
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "cheap-source-map" : "source-map",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "app.bundle.js",
      publicPath: "/dist/"
    },
    optimization: {
      minimize: false
    },
    plugins: [
      new CleanWebpackPlugin(), // <PROJECT_DIR>/dist/ is the default
      new webpack.DefinePlugin({
        ENV_IS_DEVELOPMENT: !isProduction,
        ENV_IS: JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };

  if (!isProduction) {
    // config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config = merge(config, {
      devServer: {
        contentBase: [
          path.join(__dirname, "app"),
          path.join(__dirname, "dist")
        ],
        publicPath: "/dist/",
        watchContentBase: false, // watch files served by the contentBase
        // hot: true // use with HotModuleReplacementPlugin
        hotOnly: true,
        overlay: true
      },
      plugins: [new webpack.HotModuleReplacementPlugin()]
    });
  }

  return merge(config, babelLoader, codegenLoader);
};
