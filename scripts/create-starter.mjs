#!/usr/bin/env node
/**
 * 从 demo 仓库派生 starter-template。
 *
 * 派生公式（见 docs/plans/admin-template-blueprint.md）：
 *   复制仓库 − demo/ − import '@/demo' 的路由文件 + 替换物（starter-overrides/）
 *
 * 用法：node scripts/create-starter.mjs <target-dir>
 * 之后：cd <target-dir> && git init && pnpm install && pnpm dev
 * （routeTree.gen.ts 会在首次 dev/build 时由 TanStack Router 插件重新生成）
 */
import {
  cpSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const target = process.argv[2] && resolve(process.argv[2])

if (!target) {
  console.error('Usage: node scripts/create-starter.mjs <target-dir>')
  process.exit(1)
}
if (existsSync(target) && readdirSync(target).length > 0) {
  console.error(`Target dir is not empty: ${target}`)
  process.exit(1)
}

// 1. 复制仓库（排除生成物、git 历史、文档与本脚本自身）
const EXCLUDES = ['node_modules', 'dist', '.git', 'docs', 'scripts']
cpSync(root, target, {
  recursive: true,
  filter: (src) => {
    const rel = relative(root, src)
    if (rel === '') return true
    return !EXCLUDES.some((ex) => rel === ex || rel.startsWith(`${ex}/`))
  },
})

// 2. 删 demo/
rmSync(join(target, 'src/demo'), { recursive: true })

// 3. 删所有 import '@/demo' 的路由文件（搜索参数 schema 与 demo 同生共死）
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}
const removedRoutes = []
for (const file of walk(join(target, 'src/routes'))) {
  if (readFileSync(file, 'utf8').includes('@/demo')) {
    rmSync(file)
    removedRoutes.push(relative(target, file))
  }
}

// 4. 删过期的生成文件（首次 dev/build 时插件重新生成）
rmSync(join(target, 'src/routeTree.gen.ts'), { force: true })

// 5. 写入替换物：空首页、最小 settings 路由、最小 sidebar-data
cpSync(join(root, 'scripts/starter-overrides'), target, { recursive: true })

// 6. 修剪 package.json：demo 专用依赖
const pkgPath = join(target, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
delete pkg.devDependencies['@faker-js/faker']
pkg.name = 'beatui-starter'
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`Starter created at ${target}`)
console.log(`Removed routes:\n  ${removedRoutes.join('\n  ')}`)
console.log('\nNext steps:')
console.log(`  cd ${target}`)
console.log('  git init && pnpm install && pnpm dev')
