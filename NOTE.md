# Bundling code

we use `npm` for this project.

## Run `npx` to run `webpack` from terminal

```bash
npx webpack --mode development --devtool false --entry .\app\app.js -o .\dist\app.bundle.js
```

> `--devtool false` prevents chunks wrap with `eval()`.
