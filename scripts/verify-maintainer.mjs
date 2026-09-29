import { readFile } from 'node:fs/promises'

const [maintainersPath, expectedUser] = process.argv.slice(2)

if (!maintainersPath || !expectedUser) {
  throw new Error('Usage: verify-maintainer.mjs <maintainers.json> <expected-user>')
}

const value = JSON.parse(await readFile(maintainersPath, 'utf8'))
const maintainers = (Array.isArray(value) ? value : [value])
  .map(maintainer => typeof maintainer === 'string' ? maintainer : maintainer?.name)
  .filter(Boolean)

if (!maintainers.includes(expectedUser)) {
  throw new Error(
    `Expected npm user ${expectedUser} is not a maintainer. Found: ${maintainers.join(', ') || 'none'}`
  )
}

console.log(`Verified npm maintainer: ${expectedUser}`)

