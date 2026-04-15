// Runtime shim for the api workspace package.
// `import type { App } from 'api'` is erased by Babel — this file is never
// actually executed. Metro still needs a valid module to resolve to.
module.exports = {}
