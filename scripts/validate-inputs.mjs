const {
  EXPECTED_NPM_USER: expectedNpmUser,
  OPERATION: operation,
  PACKAGE_NAME: packageName,
  PUBLISH_VERSION: publishVersion,
  REGISTRY: registry,
  STAGE_VERSION: stageVersion,
  TAG: tag,
} = process.env

const operations = new Set([
  'dist-tag-list',
  'dist-tag-add',
  'dist-tag-remove',
  'publish',
  'stage-publish',
  'smoke',
])

const packagePattern = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/
const versionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/
const tagPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/

if (!operations.has(operation)) {
  throw new Error(`Unsupported operation: ${operation}`)
}

if (!packagePattern.test(packageName || '')) {
  throw new Error(`Invalid package name: ${packageName}`)
}

if (expectedNpmUser && !/^[a-z0-9][a-z0-9-]*$/.test(expectedNpmUser)) {
  throw new Error(`Invalid expected npm user: ${expectedNpmUser}`)
}

if (registry !== 'https://registry.npmjs.org/') {
  throw new Error('Only the public npm registry is supported')
}

if (!tagPattern.test(tag || '')) {
  throw new Error(`Invalid dist-tag: ${tag}`)
}

if (tag === 'latest') {
  throw new Error('The latest tag is intentionally blocked by this smoke test')
}

const needsPublishVersion = ['publish', 'dist-tag-add', 'smoke'].includes(operation)
const needsStageVersion = ['stage-publish', 'smoke'].includes(operation)

if (needsPublishVersion && !versionPattern.test(publishVersion || '')) {
  throw new Error(`${operation} requires a valid publish_version`)
}

if (needsStageVersion && !versionPattern.test(stageVersion || '')) {
  throw new Error(`${operation} requires a valid stage_version`)
}

if (operation === 'smoke' && publishVersion === stageVersion) {
  throw new Error('publish_version and stage_version must differ')
}
