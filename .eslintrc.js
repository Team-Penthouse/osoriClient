module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'max-len': [
      'warn',
      {
        code: 100,
      },
    ],
    'no-shadow': 'off',
    // 'no-unused-vars': 'warn',
    'import/no-unresolved': 'off',
    // 선언 전에 변수가 사용될 경우 (styles가 아래 선언 되어있을 시 에러)
    'no-use-before-define': 'off',
    'no-unused-expressions': 'warn',
    // tsx 파일에서 jsx가 사용될 시 (React.Fragment도 해당됨)
    'react/jsx-filename-extension': 'off',
    // Global required() 사용 금지
    'global-require': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    // console 사용 금지
    // 불필요한 콘솔로그가 많아, 가시성을 위해 워닝으로 변경함
    'no-console': 'warn',
    // 불안정한 형태로 컴포넌트를 사용 시
    'react/no-unstable-nested-components': 'off',
    // Optional한 Props로 defaultProps에 포함되었으나 초기값이 정해지지 않은 경우
    'react/require-default-props': 'off',
    // 화살표 함수이지만 리턴값이 없을 경우
    'consistent-return': 'off',
    // 생성된 배열의 index값을 사용하는 경우
    'react/no-array-index-key': 'warn',
    'react/jsx-curly-brace-presence': 'off',
    'arrow-body-style': 'off',
    'react/function-component-definition': 'off',
    // 빈 fragment 사용하는 경우
    'react/jsx-no-useless-fragment': 'off',
    'no-else-return': 'off',
    'no-nested-ternary': 'warn',
    'import/extensions': 'off',
  },
};
