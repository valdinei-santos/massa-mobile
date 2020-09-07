module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    // 'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  rules: {
    '@typescript-eslint/indent': [2, 2],
    // 'quotes': ['error', 'single'],
  },
};
