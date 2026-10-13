#!/usr/bin/env node
// Scaffold a new build from _template.
// Usage: npm run new -- 01-word-puzzle [--skip-install]

import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const templateDir = join(root, '_template')
const readmePath = join(root, 'README.md')
const TEXT_EXTENSIONS = new Set(['.json', '.ts', '.tsx', '.css', '.html', '.md', '.svg'])

const args = process.argv.slice(2)
const skipInstall = args.includes('--skip-install')
const name = args.find((arg) => !arg.startsWith('--'))

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

if (!name) fail('Missing project name. Usage: npm run new -- 01-word-puzzle')

const match = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(name)
if (!match) fail(`"${name}" must look like NN-slug, e.g. 01-word-puzzle (lowercase, hyphens).`)

const [, number, slug] = match
if (Number(number) < 1 || Number(number) > 40) fail('Build number must be between 01 and 40.')

const existing = readdirSync(root).find((entry) => entry.startsWith(`${number}-`))
if (existing) fail(`Build ${number} already exists as "${existing}". Nothing was changed.`)

const targetDir = join(root, name)
if (existsSync(targetDir)) fail(`"${name}" already exists. Nothing was changed.`)

const title = slug
  .split('-')
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(' ')

cpSync(templateDir, targetDir, {
  recursive: true,
  filter: (src) => !/[\\/](node_modules|dist)([\\/]|$)/.test(src.slice(templateDir.length)),
})

function fillPlaceholders(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      fillPlaceholders(path)
    } else if (TEXT_EXTENSIONS.has(extname(entry))) {
      const content = readFileSync(path, 'utf8')
      const filled = content
        .replaceAll('__SLUG__', name)
        .replaceAll('__NUMBER__', number)
        .replaceAll('__TITLE__', title)
      if (filled !== content) writeFileSync(path, filled)
    }
  }
}
fillPlaceholders(targetDir)

// Mark the build as in progress in the root README table.
const readme = readFileSync(readmePath, 'utf8')
const rowPattern = new RegExp(`^\\| ${number} \\|.*$`, 'm')
if (rowPattern.test(readme)) {
  const row = `| ${number} | [${title}](./${name}) | — | 🚧 In progress |`
  writeFileSync(readmePath, readme.replace(rowPattern, row))
} else {
  console.warn(`⚠ Could not find row ${number} in README.md — update it manually.`)
}

console.log(`\n✔ Created ${name} from _template`)

if (skipInstall) {
  console.log(`\nNext:\n  cd ${name}\n  npm install\n  npm run dev\n`)
} else {
  console.log('\nInstalling dependencies…\n')
  const result = spawnSync('npm', ['install'], { cwd: targetDir, stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.status !== 0) fail(`npm install failed. Run it manually inside ${name}/.`)
  console.log(`\nNext:\n  cd ${name}\n  npm run dev\n`)
}
