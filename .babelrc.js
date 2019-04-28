module.exports = {
  presets: [
    [
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
  ]
}
