// eslint-disable-next-line no-undef
module.exports = {
  'env': {
    'node': true,
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'no-multi-spaces': ['error'],
    'no-trailing-spaces': ['error', { 'ignoreComments': true }],
    'comma-dangle': ['error', 'never'],
    'react/prop-types': ['off'],
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', {
      'ObjectExpression': {
        'multiline': true, 'minProperties': 2
      },
      'ObjectPattern': { 'multiline': true },
      'ImportDeclaration': {
        'multiline': true, 'minProperties': 2
      },
      'ExportDeclaration': {
        'multiline': true, 'minProperties': 2
      }
    }],
    'max-len': ['error', {
      'code': 80,
      'ignoreComments': true,
      'ignoreUrls': true,
      'ignoreTemplateLiterals': true,
      'ignoreStrings': true
    }],
    'react/display-name': 'off'
  }
};
