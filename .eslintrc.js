module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
  },
  plugins: ['prettier', '@typescript-eslint', 'import'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'prettier/prettier': ['error', { singleQuote: true }],
  },
};
