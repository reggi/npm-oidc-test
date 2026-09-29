import path from 'node:path'

const [packageName, packageVersion = '1.0.0'] = process.argv.slice(2)

if (!packageName) {
  throw new Error(
    'Usage: node scripts/materialize-package.mjs <package-name> [version]'
  )
}

process.env.FIXTURE_DIR = path.resolve('package')
process.env.PACKAGE_NAME = packageName
process.env.PACKAGE_VERSION = packageVersion
process.env.REGISTRY ||= 'https://registry.npmjs.org/'

await import('./prepare-package.mjs')

console.log(`Materialized ${packageName}@${packageVersion} in package/`)
