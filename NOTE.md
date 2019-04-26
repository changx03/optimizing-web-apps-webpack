# Webpack tutorial

## Bundling code

we use `npm` for this project.

### Run `npx` to run `webpack` from terminal

```bash
npx webpack --mode development --devtool false --entry .\app\app.js -o .\dist\app.bundle.js
```

> `--devtool false` prevents chunks wrap with `eval()`.

### **IIFE** - Immediately-invoked function expression

```javascript
;(function(){
  console.log('Making a function call right now!')
})()
```

### import function from module

* In development mode, webpack will copy all functions into the bundle, regardless export or not.
* In production mode, webpack only includes the functions you imported.

#### ES6 Harmony Syntax

From `HarmonyDetectionParserPlugin` function, `module.strict` is set to `true`.

IIFE wrapper and `"use strict";` are injected from `FunctionModuleTemplatePlugin` function

* `"use strict";` is included automatically when using `import` keyword.
* `require()` doesn't need `"use strict";` in the bundle.

## Accelerating Development

* watch `--watch`
* refresh `webpack-dev-server`
* hot reload - based on your framework

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

### devServer

Go to [/webpack-dev-server](http://localhost:8080/webpack-dev-server) to check generated files.

* `contentBase` Serve static files multiple folders
* `publicPath` The bundled files will be available in the browser under this path. The default value is `/`.

```javascript
devServer: {
  contentBase: [path.join(__dirname, 'app'), path.join(__dirname, 'dist')],
  publicPath: '/dist/', // backslash `/` must include at both side
  watchContentBase: true, // watch files served by the contentBase
  // hot: true // use with HotModuleReplacementPlugin
  hotOnly: true // hot load the module but prevent refresh the page
}
```

* `HotModuleReplacementPlugin` will set `hot` to `true` by default.
* `hotOnly` works when `watchContentBase` is set to `false`. Since they are overlapping each other. We include js files in `contentBase`
* the `*.hot-update.json` file will return a 404 error. Since we serve the bundle file under `/dist/`. Resolve the problem by moving `publicPath: '/dist/'` to `output` block

```javascript
output: {
  publicPath: '/dist/'
},
devServer: {
  // publicPath: '/dist/',
},
```

Angular demo for hot swapping function without reloading (keep states).

`Scoring` is a function `angular.module("klondike.scoring", []).service("scoring", [Scoring]);`

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
      .forEach(key => actualService[key] = newScoringService[key])

    doc.find('html').scope().$apply()
    console.info('[scoring] Hot swapped!')
  }
}
```

### Chrome tips

* Run filter from Chrome devtool Network tab: `-/cards -/bower_components  -/klondike`<br>
* Check `Preserve log` to preserve history from reloading

### Use `nodemon` to watch `webpack.conf.js` file changes

```json
{
  "start": "nodemon -w webpack.config.js -x webpack-dev-server -- --open"
}
```

* `-x` execute script with nodemon
* `-- --open` to tell `nodemon` the `--open` config is not for you
