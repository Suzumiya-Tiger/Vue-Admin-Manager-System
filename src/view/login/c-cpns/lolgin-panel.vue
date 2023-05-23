<template>
  <div class="login-panel">
    <h1 class="title">后台管理系统</h1>
    <div class="tabs">
      <el-tabs type="border-card" stretch v-model="activeName">
        <el-tab-pane label="账号登录" name="account">
          <template #label>
            <div class="label">
              <el-icon>
                <UserFilled />
              </el-icon>
              <span class="text">账号登录</span>
            </div>
          </template>

          <pane-account></pane-account>
        </el-tab-pane>
        <el-tab-pane label="手机登录" name="phone">
          <template #label>
            <div class="label">
              <el-icon>
                <Cellphone />
              </el-icon>
              <span class="text">手机登录</span>
            </div>
          </template>
          <pane-phone></pane-phone>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="control-account">
      <el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
      <el-link type="primary">忘记密码</el-link>
    </div>
    <el-button type="primary" class="login-btn" size="large" @click="handleLoginBtnClick">立即登录</el-button>
  </div>
</template>

<script setup lang="ts">
// import type { Cellphone } from '@element-plus/icons-vue/dist/types'
import { ref } from 'vue'
import PaneAccount from './panel-account.vue'
import PanePhone from './panel-phone.vue'
const isRemPwd = ref(false)
const activeName = ref('account')
function handleLoginBtnClick() {
  if (activeName.value === 'account') {
    console.log('账号登录')
  } else {
    console.log('手机登录')
  }
}
</script>

<style lang="less" scoped>
.login-panel {
  width: 330px;
  margin-bottom: 150px;

  .title {
    text-align: center;
    margin-bottom: 15px;
  }

  .label {
    display: flex;
    align-items: center;
    justify-content: center;

    .text {
      margin-left: 5px;
    }
  }

  .control-account {
    margin-top: 12px;
    display: flex;

    justify-content: space-between;
  }

  .login-btn {
    margin-top: 10px;
    width: 100%;
    --el-button-size: 50px !important;
  }
}
</style>
