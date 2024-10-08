module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'jsdoc',
  ],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return',
      },
    },
  }
};
