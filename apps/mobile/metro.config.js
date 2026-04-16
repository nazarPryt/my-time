const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Watch workspace packages so Metro picks up changes
config.watchFolders = [monorepoRoot]

// Resolve node_modules from both project and monorepo root
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, 'node_modules'),
	path.resolve(monorepoRoot, 'node_modules'),
]

// Map `api` → empty shim at bundle time.
// TypeScript gets the real types via tsconfig.json paths (compile-time only).
const _resolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName === 'api') {
		return {
			filePath: path.resolve(projectRoot, 'shims/api-shim.js'),
			type: 'sourceFile',
		}
	}
	return (_resolveRequest ?? context.resolveRequest)(
		context,
		moduleName,
		platform,
	)
}

module.exports = config
