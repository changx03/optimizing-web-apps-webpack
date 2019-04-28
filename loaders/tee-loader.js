module.exports = function(source) {
  console.groupCollapsed('[tee-loader]' + this.resource)
  console.log(source)
  console.groupEnd()
  return source
}
