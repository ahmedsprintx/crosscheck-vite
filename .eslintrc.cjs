module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'eslint-config-prettier',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '**/*.config.*'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['react-refresh', 'eslint-plugin-no-inline-styles', 'check-file', 'no-comments'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    // Enforce kebab-case for filenames
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{jsx,tsx}': 'KEBAB_CASE',
        '**/*.{js,ts}': 'KEBAB_CASE',
        '**/*.{css,scss}': 'KEBAB_CASE',
        '**/*.{svg,png,jpg,jpeg,icon}': 'KEBAB_CASE',
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'KEBAB_CASE',
        'mocks/*/': 'KEBAB_CASE',
      },
    ],

    //Enforce no-comments
    'no-comments/disallowComments': [
      'warn',
      {
        allow: ['TODO:', 'FIXME:', 'NOTE:', 'DEBUG:'],
      },
    ],
    //enforce the use of no inline styling
    'no-inline-styles/no-inline-styles': 2,
  },
};