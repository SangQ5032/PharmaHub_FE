module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    jest: true, // Thêm dòng này
  },
  rules: {
    'no-undef': 'error',                // Bắt lỗi biến chưa khai báo
    '@typescript-eslint/no-unused-vars': 'warn',  // Báo biến không dùng
     "@typescript-eslint/no-explicit-any": "off"
  },
};
