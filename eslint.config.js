import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [
  includeIgnoreFile(gitignorePath),

  { files: [ '**/*.{js,mjs,cjs,ts}' ] },

  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: ts.parser,
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  js.configs.recommended,

  ...ts.configs.recommendedTypeChecked,
  {
    files: [ '!src/*' ],
    ...ts.configs.disableTypeChecked,
  },
  {
    rules: {
      // This rule does NOT exist yet... https://github.com/typescript-eslint/typescript-eslint/issues/4571
      //'@typescript-eslint/no-unused-private-class-members': [ 'error' ],
    },
  },

  stylistic.configs['recommended-flat'],
  {
    rules: {
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/spaced-comment': [ 'off' ],
    },
  },
]
