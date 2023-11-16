<template>
  <div class="pane-phone">
    <el-form
      :rules="accountRules"
      :label-position="labelPosition"
      ref="formRef"
      label-width="60px"
      :model="account"
      style="max-width: 460px"
    >
      <el-form-item label="用户" prop="name">
        <el-input v-model="account.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          :type="showPassword ? CACHE_PASSWORD : ''"
          v-model="account.password"
        >
          <template #suffix v-if="showPassword">
            <el-icon style="cursor: pointer" @click="translateShow">
              <View />
            </el-icon>
          </template>
          <template #suffix v-else-if="!showPassword">
            <el-icon style="cursor: pointer" @click="translateShow">
              <Hide />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import useLoginStore from '@/store/login/login'
import { localCache } from '@/utils/cache'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormRules, ElForm } from 'element-plus'

// 导入业务页面需要的类型
import type { IAccount } from '@/types'

const CACHE_NAME = 'name'
const CACHE_PASSWORD = 'password'

const labelPosition = ref('right')
// 1.定义account的初始数据，无法从本地获取时则输出为空
const account = reactive<IAccount>({
  name: localCache.getCache(CACHE_NAME) ?? '',
  password: localCache.getCache(CACHE_PASSWORD) ?? ''
})
// 引入login的pinia状态(激活该实例使其内部方法可以被调用)
const loginStore = useLoginStore()
const showPassword = ref(true)
// 2.定义校验规则
const accountRules: FormRules = {
  /* 两部分组成：一个是必传校验，一个是传入数据校验，支持正则表达式 */
  name: [
    { required: true, message: '必须输入帐号信息~', trigger: 'blur' },
    {
      pattern: /^[a-z0-9]{4,20}$/,
      message: '必须4~20位数字/字母组成',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '必须输入密码信息', trigger: 'blur' },
    {
      pattern: /^[a-z0-9]{6,20}$/,
      message: '必须是6位以上的数字/字母组成',
      trigger: 'blur'
    }
  ]
}
function translateShow() {
  showPassword.value = !showPassword.value
}
// 3.执行帐号的登录逻辑
// InstanceType<typeof ElForm> 获取实例构造器(typeof ElForm)的实例类型(即返回的实例)
const formRef = ref<InstanceType<typeof ElForm>>()
function loginAction(isRemPwd: Boolean) {
  formRef.value?.validate((valid) => {
    if (valid) {
      // 1.获取用户输入的账号和密码
      const name = account.name
      const password = account.password
      // 2.向服务器发送网络请求(携带账号和密码)
      // 调用其action的内部方法
      loginStore.loginAccountAction({ name, password }).then(() => {
        // 3.判断要不要记住密码
        if (isRemPwd) {
          localCache.setCache(CACHE_NAME, name)
          localCache.setCache(CACHE_PASSWORD, password)
        } else {
          localCache.removeCache(CACHE_NAME)
          localCache.removeCache(CACHE_PASSWORD)
        }
      })
    } else {
      ElMessage.error('请输入正确的格式后再操作')
    }
  })
}
// 暴露子组件的方法给父组件使用
defineExpose({
  loginAction
})
</script>
<style lang="less" scoped></style>
