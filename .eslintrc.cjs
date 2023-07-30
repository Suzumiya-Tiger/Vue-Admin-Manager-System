/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    // 读取prettierrc.json里面的prettier配置，令其匹配prettier的配置效果
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/comment-directive': 'off',
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off'
  }
}
