<template>
  <div class="login-panel">
    <div class="tabs">
      <el-tabs stretch class="loginCard" v-model="activeName">
        <el-tab-pane label="帐号登录" name="account">
          <!-- 使用指定的具名插槽进行插槽内容自定义 -->
          <template #label>
            <div class="label">
              <el-icon>
                <UserFilled />
              </el-icon>
              <span class="text">账号登录</span>
            </div>
          </template>
          <!-- ref和定义的常量ref组件实例相关联 -->
          <pane-account ref="accountRef"></pane-account>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="control-account">
      <el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
      <el-link type="primary">忘记密码</el-link>
    </div>
    <el-button
      :loading="btnLoading"
      type="primary"
      class="login-btn"
      size="large"
      @click="handleLoginBtnClick"
      >立即登录</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { localCache } from '@/utils/cache'
import { ref, watch } from 'vue'
import PaneAccount from './panel-account.vue'

const btnLoading = ref(false)
const isRemPwd = ref<boolean>(localCache.getCache('isRemPwd') ?? false)
watch(isRemPwd, (newVal) => {
  localCache.setCache('isRemPwd', newVal)
})

// typeof PaneAccount 所拿到的是一个构造器，InstanceType要求获取的是一个构造器
/* InstanceType<typeof PaneAccount>: InstanceType 是 TypeScript 中的一个内置类型，
  它用于获取一个类的实例类型。通过 typeof PaneAccount 获取到 PaneAccount 类的类型，
  然后用 InstanceType 将其转换为 PaneAccount 类的实例类型。 */
// 通过调用ref可以获取对应的组件实例
const accountRef = ref<InstanceType<typeof PaneAccount>>()
const activeName = 'account'
function handleLoginBtnClick() {
  btnLoading.value = true

  // 1.获取子组件的实例(defineExpose暴露出来的组件在这里可以结合ref来获取其内部方法/属性)
  // 这里需要用可选链，因为不能保证后续的函数一定存在
  accountRef.value?.loginAction(isRemPwd.value)
  btnLoading.value = false
}
</script>

<style lang="less" scoped>
.login-panel {
  padding: 90px;
  border: 1px solid #f5f3f3;
  border-radius: 8px;
  width: 330px;
  margin-bottom: 150px;

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
