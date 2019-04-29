/**
 * This file uses node.js modules. it won't compile from webpack.
 * It is required to run from a node.js loader.
 */
const util = require('util')
const execPromise = util.promisify(require('child_process').exec)

async function captureBuildInformation() {
  const { stdout } = await execPromise('git rev-parse HEAD')
  const compiledAt = new Date().toISOString()
  const commitSha = stdout.replace('\n', '')

  return {
    code: `export const compiledAt = '${compiledAt}'; export const commit = '${commitSha}';`
  }
}

module.exports = captureBuildInformation
