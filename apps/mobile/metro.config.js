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
	// Force zustand to always resolve from mobile's node_modules.
	// packages/features has its own bun-managed zustand symlink that points to a
	// different physical copy — two zustand instances → two React instances → hooks crash.
	if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
		return {
			filePath: require.resolve(moduleName, { paths: [projectRoot] }),
			type: 'sourceFile',
		}
	}
	if (moduleName === 'api') {
		return {
			filePath: path.resolve(projectRoot, 'shims/api-shim.js'),
			type: 'sourceFile',
		}
	}
	if (moduleName === 'features') {
		return {
			filePath: path.resolve(monorepoRoot, 'packages/features/src/index.ts'),
			type: 'sourceFile',
		}
	}
	if (moduleName === 'features/workout') {
		return {
			filePath: path.resolve(
				monorepoRoot,
				'packages/features/src/workout/index.ts',
			),
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
