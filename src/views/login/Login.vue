<template>
  <div class="login">
    <h1 class="title">春日后台管理系统</h1>
    <login-panel />
    <p>用户名：haruhi 密码：123456</p>
  </div>
</template>

<script setup lang="ts">
import LoginPanel from './c-cpns/login-panel.vue'
</script>

<style lang="less" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: url('@/assets/img/login-bg.svg');
}
.title {
  font-weight: normal;
  font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
  text-align: center;
  margin-bottom: 55px;
}
</style>
