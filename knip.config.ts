import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/components/ui/**', 'src/components/features/**'],
  ignore: [
    'src/components/layout/app-title.tsx',
    'src/tanstack-table.d.ts',
  ],
}

export default config