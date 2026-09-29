import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const script = fileURLToPath(new URL('../scripts/validate-inputs.mjs', import.meta.url))
const baseEnv = {
  EXPECTED_NPM_USER: 'reggi',
  OPERATION: 'dist-tag-list',
  PACKAGE_NAME: '@example/oidc-fixture',
  PUBLISH_VERSION: '',
  REGISTRY: 'https://registry.npmjs.org/',
  STAGE_VERSION: '',
  TAG: 'oidc-smoke',
}

const validate = overrides => spawnSync(
  process.execPath,
  [script],
  {
    encoding: 'utf8',
    env: { ...process.env, ...baseEnv, ...overrides },
  }
)

test('accepts the read-only operation without versions', () => {
  assert.equal(validate({}).status, 0)
})

test('requires separate versions for the full smoke test', () => {
  const result = validate({
    OPERATION: 'smoke',
    PUBLISH_VERSION: '1.0.0-smoke.1',
    STAGE_VERSION: '1.0.0-smoke.1',
  })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /must differ/)
})

test('blocks the latest tag', () => {
  const result = validate({ TAG: 'latest' })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /intentionally blocked/)
})

test('blocks non-public registries', () => {
  const result = validate({ REGISTRY: 'https://registry.example.test/' })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /public npm registry/)
})
