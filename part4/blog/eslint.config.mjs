import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      eqeqeq: 'error',
      'no-console': 'off',
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    ignores: ['dist/**'],
  },
]
