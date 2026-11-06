#!/usr/bin/env node
// Umbrella build: every NN-slug project goes to dist/NN-slug/, plus a home page
// at dist/index.html listing all 40 builds from the table in the root README.

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const run = (command, cwd) => execSync(command, { cwd, stdio: 'inherit' })

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist)

const folders = readdirSync(root).filter((name) => /^\d{2}-/.test(name) && existsSync(join(root, name, 'package.json')))

for (const folder of folders) {
  console.log(`\n▸ Building ${folder}`)
  const cwd = join(root, folder)
  run('npm ci', cwd)
  run(`npm run build -- --base=/${folder}/ --outDir=${join(dist, folder)} --emptyOutDir`, cwd)
}

const rows = [...readFileSync(join(root, 'README.md'), 'utf8').matchAll(/^\| (\d{2}) \| (.+?) \| .*? \| (.+?) \|$/gm)].map(
  ([, number, project, status]) => {
    const link = /^\[(.+)\]\(\.\/(.+)\)$/.exec(project)
    return { number, name: link ? link[1] : 'To be announced', folder: link?.[2], status: status.replace(/^\S+\s/, '') }
  },
)

const items = rows
  .map(({ number, name, folder, status }) => {
    const built = folder && folders.includes(folder)
    const label = `<span class="n">${number}</span><span class="t">${name}</span><span class="s">${status}</span>`
    return built ? `<li><a href="/${folder}/">${label}</a></li>` : `<li class="off"><span class="row">${label}</span></li>`
  })
  .join('\n')

writeFileSync(
  join(dist, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="40 small design engineering projects, built in public." />
<link rel="icon" href="/01-word-puzzle/favicon.svg" />
<title>40 Builds</title>
<style>
:root { --bg: #f6f5f1; --ink: #151513; --muted: #63625c; --line: #d9d7cf; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --bg: #151513; --ink: #f6f5f1; --muted: #a5a39b; --line: #33322e; color-scheme: dark; } }
* { box-sizing: border-box; }
body { margin: 0; min-width: 360px; background: var(--bg); color: var(--ink); font: 16px/1.5 ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
main { max-width: 760px; margin: 0 auto; padding: 64px 24px; }
h1 { margin: 0; font-size: clamp(40px, 10vw, 72px); line-height: 1; letter-spacing: -0.03em; }
p { margin: 16px 0 40px; color: var(--muted); }
ol { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
li { border-bottom: 1px solid var(--line); }
a, .row { display: flex; gap: 16px; align-items: baseline; padding: 14px 0; color: inherit; text-decoration: none; }
a:hover .t { text-decoration: underline; text-underline-offset: 4px; }
a:focus-visible { outline: 3px solid currentColor; outline-offset: 2px; }
.n { width: 2ch; color: var(--muted); font-variant-numeric: tabular-nums; }
.t { flex: 1; font-weight: 600; }
.s { color: var(--muted); font-size: 14px; }
.off .t { font-weight: 400; color: var(--muted); }
</style>
</head>
<body>
<main>
<h1>40 Builds</h1>
<p>40 small design engineering projects, built in public.</p>
<ol>
${items}
</ol>
</main>
</body>
</html>
`,
)

console.log(`\n✔ Built ${folders.length} project(s) into dist/`)
