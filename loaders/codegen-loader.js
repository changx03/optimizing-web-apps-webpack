const Module = require('module')

/**
 * loadModule has similar behavior as `require()` function
 * @param {*} code 
 * @param {*} loaderContext 
 */
function loadModule(code, loaderContext) {
  const filename = loaderContext.resource
  const module = new Module(filename, loaderContext)
  module.paths = Module._nodeModulePaths(loaderContext.context)
  module.filename = filename
  module._compile(code, filename)
  return module.exports
}

module.exports = async function(compileTimeModule) {
  const loaderContext = this
  const codeGenerator = loadModule(compileTimeModule, loaderContext)
  const generatedRuntimeModule = await codeGenerator()
  return generatedRuntimeModule.code
}
