/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { playwright } from '@vitest/browser-playwright'
import ts from 'typescript'

/**
 * Dev-only plugin: stamps every host element (div, button, …) with
 * data-source="<file>:<line>" so any DOM node maps straight back to its JSX —
 * readable by humans in devtools and by AI agents inspecting the DOM.
 * Splices the attribute into raw TSX before the JSX transform (plugin-react v6
 * runs on oxc, so a Babel plugin is not an option). Never runs on builds.
 */
function jsxDataSource(): Plugin {
  let root = process.cwd()
  return {
    name: 'jsx-data-source',
    apply: 'serve',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    transform(code, id) {
      const file = id.split('?')[0]
      if (!file.endsWith('.tsx') || file.includes('/node_modules/')) return
      const sourceFile = ts.createSourceFile(
        file,
        code,
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TSX
      )
      const rel = path.relative(root, file).split(path.sep).join('/')
      const inserts: { pos: number; line: number }[] = []
      const visit = (node: ts.Node) => {
        if (
          (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
          ts.isIdentifier(node.tagName) &&
          /^[a-z]/.test(node.tagName.text)
        ) {
          inserts.push({
            pos: node.tagName.end,
            line:
              sourceFile.getLineAndCharacterOfPosition(
                node.getStart(sourceFile)
              ).line + 1,
          })
        }
        ts.forEachChild(node, visit)
      }
      visit(sourceFile)
      if (inserts.length === 0) return
      let out = code
      for (const { pos, line } of inserts.sort((a, b) => b.pos - a.pos)) {
        out = `${out.slice(0, pos)} data-source="${rel}:${line}"${out.slice(pos)}`
      }
      return { code: out, map: null }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    jsxDataSource(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    silent: 'passed-only',
    unstubEnvs: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      // include: ['src/**/*.{js,jsx,ts,tsx}'], // Uncomment to expand the report to all src/**/* so untested modules appear as 0% coverage.
      exclude: [
        'src/components/ui/**',
        'src/assets/**',
        'src/tanstack-table.d.ts',
        'src/routeTree.gen.ts',
        'src/test-utils/**',
        'src/routes/**',
      ],
    },
  },
})
