<template>
  <div class="login-panel">
    <h1 class="title">春日后台管理系统</h1>
    <div class="tabs">
      <el-tabs type="border-card" stretch v-model="activeName">
        <el-tab-pane label="帐号登录" name="account">
          <template #label>
            <div class="label">
              <el-icon>
                <UserFilled />
              </el-icon>
              <span class="text">账号登录</span>
            </div>
          </template>

          <pane-account ref="accountRef"></pane-account>
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
    <el-button :loading="btnLoading" type="primary" class="login-btn" size="large"
      @click="handleLoginBtnClick">立即登录</el-button>
  </div>
</template>

<script setup lang="ts">
// import type { Cellphone } from '@element-plus/icons-vue/dist/types'
import { ref, watch } from 'vue'
import PaneAccount from './panel-account.vue'
import PanePhone from './panel-phone.vue'
import { localCache } from '@/utils/cache'

const btnLoading = ref(false)
const isRemPwd = ref<boolean>(localCache.getCache('isRemPwd') ?? false)
watch(isRemPwd, (newVal) => {
  localCache.setCache('isRemPwd', newVal)
})
/*
typeof PaneAccount 所拿到的是一个构造器，InstanceType要求获取的是一个构造器
*/
const accountRef = ref<InstanceType<typeof PaneAccount>>()
const activeName = ref('account')

function handleLoginBtnClick() {
  btnLoading.value = true
  if (activeName.value === 'account') {
    // 1.获取子组件的实例(defineExpose暴露出来的组件在这里可以结合ref来获取其内部方法/属性)
    // 这里需要用可选链，因为不能保证后续的函数一定存在
    const res = accountRef.value?.loginAction(isRemPwd.value)
    btnLoading.value = false
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
