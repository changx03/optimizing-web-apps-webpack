module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        debug: true,
        modules: false,
        targets: {
          browsers: ['> 1%'] // ['> 1%', 'not IE <= 11']
        },
        useBuiltIns: 'usage'
      }
    ]
  ]
}
