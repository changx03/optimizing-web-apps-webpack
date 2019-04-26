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
* refresh
* hot reload

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

Serve static files multiple folders

```javascript
devServer: {
  contentBase: [path.join(__dirname, 'app'), path.join(__dirname, 'dist')]
}
```
