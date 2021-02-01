module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [`./tsconfig.json`],
    createDefaultProgram: true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'no-use-before-define': ['error', { functions: false }],
  },
  env: {
    browser: true,
  },
};
