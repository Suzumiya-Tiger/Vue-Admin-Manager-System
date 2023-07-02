<template>
  <div class="pane-phone">
    <el-form :rules="accountRules" :label-position="labelPosition" ref="formRef" label-width="60px" :model="account"
      style="max-width: 460px">
      <el-form-item label="用户" prop="name">
        <el-input v-model="account.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input :type="showPassword ? 'password' : ''" v-model="account.password">
          <template #suffix v-if="showPassword">
            <el-icon style="cursor:pointer" @click="translateShow">
              <View />
            </el-icon>
          </template>
          <template #suffix v-else-if="!showPassword">
            <el-icon style="cursor:pointer" @click="translateShow">
              <Hide />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormRules, ElForm } from 'element-plus'
const labelPosition = ref('right')
const account = reactive({
  name: '',
  password: ''
})
const showPassword = ref(true)
// 2.定义校验规则
const accountRules: FormRules = {
  /* 两部分组成：一个是必传校验，一个是传入数据校验，支持正则表达式 */
  name: [
    { required: true, message: '必须输入帐号信息~', trigger: 'blur' },
    { pattern: /^[a-z0-9]{6,20}$/, message: '必须6~20位数字/字母组成', trigger: 'blur' }
  ],
  passwords: [
    { required: true, message: '必须输入密码信息', trigger: 'blur' },
    { pattern: /^[a-z0-9]{6,20}$/, message: '必须是6位以上的数字/字母组成', trigger: 'blur' }
  ]
}
function translateShow() {
  showPassword.value = !showPassword.value;

}
// 3.执行帐号的登录逻辑
const formRef = ref<InstanceType<typeof ElForm>>()
function loginAction() {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log('first');
    } else {
      ElMessage.error('请输入正确的格式后再操作')
    }

  })
}
// 暴露子组件的方法去外部
defineExpose({
  loginAction
})
</script>
<style lang="less" scoped></style>
