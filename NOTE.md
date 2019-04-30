# Webpack tutorial

## Chapter: Bundling code

we use `npm` for this project.

### Use `npx` to run `webpack` from terminal

```bash
npx webpack --mode development --devtool false --entry .\app\app.js -o .\dist\app.bundle.js
```

- `--devtool false` prevents chunks wrap with `eval()`.

### **IIFE** - Immediately-invoked function expression

```javascript
;(function() {
  console.log('Making a function call right now!')
})()
```

### Import function from module

- In `development` mode, webpack will copy all functions into the bundle, regardless export or not.
- In `production` mode, webpack only includes the functions you imported.

### Webpack

2 major components:

- **Plugin** operates on compilation level
- **Loader** operates on module level

#### ES6 Harmony Syntax

From `HarmonyDetectionParserPlugin` function, `module.strict` is set to `true`.

IIFE wrapper and `"use strict";` are injected from `FunctionModuleTemplatePlugin` function

- `"use strict";` is included automatically when using `import` keyword.
- `require()` doesn't need `"use strict";` in the bundle.

```javascript
'use strict'
__webpack_require__.r(__webpack_exports__)
/* harmony import */ var _klondike_scoring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
  /*! ./klondike/scoring */ './app/klondike/scoring.js'
)
/* harmony import */ var _klondike_scoring__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
  _klondike_scoring__WEBPACK_IMPORTED_MODULE_0__
)
```

## Chapter: Accelerating Development

- watch `--watch`
- refresh `webpack-dev-server`
- hot reload - based on your framework

Use `npx` to run any local npm package

```bash
npx webpack --mode development --devtool false --entry .\app\app.js -o .\dist\app.bundle.js --watch
```

```bash
npm install -D webpack-dev-server

npx webpack-dev-server --mode development --devtool cheap-module-eval-source-map --entry .\app\app.js -o .\dist\app.bundle.js
```

To run `npm run build` with `--watch` flag:

```json
{
  "watch": "npm run build -- --watch"
}
```

The `--` in front of `-- --watch` tells this flag is not for npm.

### devServer

Go to [/webpack-dev-server](http://localhost:8080/webpack-dev-server) to check generated files.

- `contentBase` Serve static files multiple folders
- `publicPath` The bundled files will be available in the browser under this path. The default value is `/`.

```javascript
devServer: {
  contentBase: [path.join(__dirname, 'app'), path.join(__dirname, 'dist')],
  publicPath: '/dist/', // backslash `/` must include at both side
  watchContentBase: true, // watch files served by the contentBase
  // hot: true // use with HotModuleReplacementPlugin
  hotOnly: true, // hot load the module but prevent refresh the page
  overlay: true // show error on top of the page
}
```

- `HotModuleReplacementPlugin` will set `hot` to `true` by default.
- `hotOnly` works when `watchContentBase` is set to `false`. Since they are overlapping each other. We include js files in `contentBase`

The `*.hot-update.json` file will return a 404 error. Since we serve the bundle file under `/dist/`. Resolve the problem by moving `publicPath: '/dist/'` to `output` block

```javascript
output: {
  publicPath: '/dist/'
},
devServer: {
  // publicPath: '/dist/',
},
```

### Hot module replacement

webpack.config.js

```javascript
devServer: {
  hot: true
},
plugins: [
  new webpack.HotModuleReplacementPlugin()
]
```

scoring.js

```javascript
if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!')
    printMe()
  })
}
```

[Link](https://webpack.js.org/guides/hot-module-replacement/)

#### Angular demo for hot swapping function without reloading (keep states)

`Scoring` is a function `angular.module("klondike.scoring", []).service("scoring", [Scoring]);`

Add the script to `.app/klondike/scoring.js` file:

```javascript
console.log('[scoring] evaluating')
if (module.hot) {
  module.hot.accept(console.log.bind(console))

  const doc = angular.element(document)
  const injector = doc.injector()
  if (injector) {
    const actualService = injector.get('scoring')
    const newScoringService = new Scoring()
    Object.keys(actualService)
      .filter(key => typeof actualService[key] === 'function')
      .forEach(key => (actualService[key] = newScoringService[key]))

    doc
      .find('html')
      .scope()
      .$apply()
    console.info('[scoring] Hot swapped!')
  }
}
```

In `app.bundle.js` file, this script will be wrapped with:

```javascript
;(function(module, exports, __webpack_require__) {
  /* your code */
})
```

### Chrome tips

- Run filter from Chrome devtool Network tab: `-/cards -/bower_components -/klondike`. `-` means exclude.
- Check `Preserve log` to preserve history from reloading

### Use `nodemon` to watch `webpack.conf.js` file changes

```json
{
  "start": "nodemon -w webpack.config.js -x webpack-dev-server -- --open"
}
```

- `-w` watch path/file
- `-x` execute script with nodemon
- `-- --open` to tell `nodemon` the `--open` config is not for you

## Chapter: Dev Isn't Prod

Let's set environment variable in `package.json` file:

```json
"scripts": {
  "build:dev_win": "set NODE_ENV=development&& webpack",
  "build:dev_unit": "NODE_ENV=development webpack",
}
```

Windows and Linux/Mac use different bash script to set environment.

### Read environment variable from `webpack.config.js` file

```javascript
const isDev = process.env.NODE_ENV === 'development'
console.log('NODE_ENV=' + process.env.NODE_ENV)

const config = {
  mode: isDev ? 'development' : 'production',
  plugins: []
  /* shared configurations */
}

if (isDev) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}
```

### Minimize bundle

```javascript
optimization: {
  minimize: false
},
```

### Merge 2 config files with `Object.assign(target, source)`

In `webpack.prod.js` file:

```javascript
const dev = rquire('./webpack.config.js')

const prod = {
  devtool: 'cheap-source-map',
  mode: 'production',
  optimization: {
    minimize: true
  },
  plugins: ['MyPluginA', 'MyPluginB']
}

module.exports = Object.assign(dev, prod)
```

### Exporting multiple configurations

`name` is used for multiple configurations. This `name` field is for console reference only. The bundle file doesn't include it.

config file accept exporting function. In `function(env, argv) { return config }`, `env` is the `--env` flag, `argv` includes all flags.

You can also include your custom argument.

For example:

```bash
npx webpack --config webpack.multi.js --env production --hello Hello
```

It will return `env = 'production'` and `argv.hello = 'Hello'`

```javascript
const baseConfig = {
  mode: 'development',
  entry: './app/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '/dist/'
  },
  plugins: []
}

module.exports = [
  {
    name: 'other',
    mode: 'development',
    entry: './app/app.js',
    output: {
      path: path.join(__dirname, 'other', 'dist'),
      filename: 'app.bundle.js',
      publicPath: '/dist/'
    }
  },
  function(env, argv) {
    console.log(env, argv)
    baseConfig.name = 'base'
    baseConfig.output.path = path.join(__dirname, 'base', 'dist')
    return baseConfig
  }
]
```

### Separate configuration into multiple files

webpack.config.js
webpack.config.dev.js
webpack.config.prod.js

Use `webpack-merge` or `Object.assign(target, source)`.

```javascript
function() {
  // baseConfig.name = 'base'
  // baseConfig.output.filename = 'app.base.bundle.js'
  const config = merge(baseConfig, {
    name: 'base',
    output: {
      filename: 'app.base.bundle.js'
    }
  })
  console.log(config)
  return config
}
```

### Creating webpack plugin to inspect options

A plugin for webpack consists of

- A named JavaScript function.
- Defines `apply` method in its prototype.
- Specifies an event `hook` to `tap` into.
- Manipulates webpack internal instance specific data.
- Invokes webpack provided callback after functionality is complete.

[Link](https://webpack.js.org/contribute/writing-a-plugin/) to **write a plugin**

```javascript
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
```

### DefinePlugin

Add global variable using `webpackDefinePlugin`.

`DefinePlugin` applies simple code replacement. `string` need to wrap with `JSON.stringify()`.

```javascript
plugins: [
  new webpack.DefinePlugin({
    IS_DEV_MODE: process.env.NODE_ENV === 'development',
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  })
]
```

From `scoring.js` file

```javascript
if (IS_DEV_MODE) {
  console.log('[scoring] evaluating')
}
```

`webpack.EnvironmentPlugin` can do the same thing for `process.env.*` [Link](https://webpack.js.org/plugins/environment-plugin)

## Chapter: Transpiling: Using the future now

### Babel

Tools are required for transpiling:

- `babel-loader`

webpack 4.x, babel-loader 8.x, babel 7.x

```bash
npm install -D babel-loader @babel/core @babel/preset-env
```

[Link](https://github.com/babel/babel-preset-env#options) for `babel-preset-env` options

Using 2nd object in the array to pass extra options in the preset

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)|(bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                debug: true,
                modules: false,
                targets: {
                  browsers: ['last 1 version', '> 1%', 'IE 11']
                },
                babelrc: false // ignore .babelrc file
                // filename: '<filename>.js' // define alternative config file
              }
            ]
          ]
        }
      }
    }
  ]
}
```

`modules` option controls the `import/require` syntax

`targets.browsers` uses [browserlist](https://github.com/browserslist/browserslist)

`'not IE <= 11'` excludes IE.

Note

> Only IE doesn't have full `class` support now.

#### babel-cli

```bash
npx babel app/klondike/scoring.es6.js
```

Extract babel options from `webpack.config.js` into a new file `.babelrc.js`

```javascript
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        debug: true,
        modules: false,
        targets: {
          browsers: ['> 1%', 'not IE <= 11']
        }
      }
    ]
  ]
}
```

The babel-cli will load the configuration automatically

We can also remove the options from `webpack.config.js`.
`babel` will load the `.babelrc.js` file.

#### Disable babel in **development** mode

We don't have to transform if we know we have the latest browser.

#### Polyfills

> use `unpkg.com/<package_name>` to load package file from browser

```bash
npm install -D @babel/polyfill
```

> Warning: `import "@babel/polyfill";` should be used before `promise`, as early as possible

Instead of import entire `core-js`, only import promise

```javascript
// import "@babel/polyfill";
import 'core-js/es6/promise'
```

[Link](https://github.com/zloirock/core-js#ecmascript-promise) to `core-js` package

Use `useBuiltIns: 'entry'` option in `@babel/preset-env` to enable polyfill. After changing to `usage`, babel will only polyfill the functions we used in the code

Don't include `import "@babel/polyfill";` when using `useBuiltIns: 'usage'`.

```javascript
;[
  '@babel/preset-env',
  {
    debug: false,
    modules: false,
    targets: {
      browsers: ['> 1%'] // ['> 1%', 'not IE <= 11']
    },
    useBuiltIns: 'usage',
    corejs: 3 // the core-js version used by polyfill
  }
]
```

## Lecture: Loaders

### Pipeline

source -> babel-loader -> bundle

What we will build:

source -> **tee-loader** -> babel-loader -> **tee-loader** -> bundle

Loaders are run in **reverse** order (e.g. `teeLeader(babelLoader(source))`)

### How can webpack find loader

webpack.config.js

```javascript
module.exports = {
  //...
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  }
}
```

[Link](https://webpack.js.org/api/loaders/#examples) for webpack loader

### Using `node` to run webpack

Using the console collapse feature

tee-loader.js

```javascript
module.exports = function(source) {
  console.groupCollapsed('[tee-loader]' + this.resource)
  console.log(source)
  console.groupEnd()
  return source
}
```

Install Chrome extension `Node.js V8 --inspector Manager`

In windows

```bash
set NODE_ENV=production&& node --inspect-brk ./node_modules/webpack/bin/webpack.js
```

### 2 ways to set options

Using query string

```javascript
'tee-loader?label=after'
```

Pass an object

```javascript
{
  loader: 'tee-loader',
  options: {
    label: 'before'
  }
}
```

### Retrieve options from loader

```javascript
const loaderUtils = require('loader-utils')
module.exports = function(source) {
  const options = loaderUtils.getOptions(this) || { label: '' }
}
```

### Running inline loader

Under this setup, the `tee-loader` will only run on `scoring.es6.js`

app.js

```javascript
import 'tee-loader!./klondike/scoring.es6'
```

babelloader.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)|(bower_components)/,
        use: ['babel-loader']
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
```

This mean `scoring.es6.js` will only run the `tee-loader`.

```javascript
import '!!tee-loader!./klondike/scoring.es6'
```

Running multiple loader with reverse order and passing query parameter

```javascript
import '!!tee-loader?label=after!babel-loader!tee-loader?label=before!./klondike/scoring.es6'
```

Further study [Patching Loader](https://webpack.js.org/api/loaders/#pitching-loader)

source -> babel-loader -> cache-loader -> bundle

## Running Build Tasks

### Cleaning output folder

Unix **remove** -r recursive -f force

```bash
rm -rf dist
```

Windows **RMDIR**

```bash
# cmd /s remove subdirectories /q quiet mode
rd /s /q "dist"
# PowerShell
rd -r "dist"
```

Plugins will perform anther build tasks

```bash
npm i -D clean-webpack-plugin
```

All files inside webpack's output.path directory will be removed once, but the directory itself will not be.

[Link](https://github.com/johnagan/clean-webpack-plugin/blob/master/src/clean-webpack-plugin.ts) for the `clean-webpack-plugin` source file

### Popular plugins

- CopyWebpackPlugin
- HtmlWebpackPlugin
- CompressionWebpackPlugin
- ZopfliWebpackPlugin

[Awesome Webpack](https://github.com/webpack-contrib/awesome-webpack)

## Troubleshooting with Source Maps

webpack.config.js

```javascript
{
  devtool: 'source-map'
}
```

In `app.bundle.js` file: `sourceMappingURL=app.bundle.js.map`

The `app.bundle.js.map` is a JSON file. Open the URL with _Firefox_ to view it

### `eval`

- Source map maps to the code after babel transform
- Fastest
- In line. No mapping file
- The transformed code wrapped with `eval()` in `app.bundle.js` file
- Debug babel

### `eval-source-map`

- In line
- `sourceMappingURL` contains base64 string

#### Decode base64 string

mac

```bash
pbpaste | base64 -D
```

windows: save base64 string to a file `base64in.txt`

```bash
certutil -decode base64in.txt base64out
```

`base64out` is a JSON object

### Exporting config as a function

```javascript
module.exports = function(env, argv) {
  console.log(env.production)
}
```

Passing environment options

```bash
# set production to false
webpack --env.production=false
# set production to true
webpack --env.production
```
### `hidden-source-map`

- Source map can leak our source code
- With hidden source map, error points to `app.bundle.js`.
- In Chrome, from **Sources** tab, right click and click **Add source map...**, then the error will point to original file

`output.sourceMapFilename` option allows to rename source map.

### `nosources-source-map`

- Creating mapping but with no source file point to it
- Only know the line number

### Source map string just multiple parameters built into a string

```javascript
plugins: [
  new webpack.SourceMapDevToolPlugin({
    filename: '[name].map',
    noSources: false
  })
]
```

## Generating Code

### `code-generator-loader`

Build a custom loader

modular code -> code-generator-loader -> bundle

`buildInfo.gen.js`
