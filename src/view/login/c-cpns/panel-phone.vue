<template>
  <div class="pane-phone">
    <el-form :rules="accountRules" :label-position="labelPosition" label-width="60px" :model="formLabelAlign"
      style="max-width: 460px">
      <el-form-item label="用户" prop="name">
        <el-input v-model="formLabelAlign.label"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input :type="showPassword ? 'password' : ''" v-model="formLabelAlign.password">
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
import type { FormRules } from 'element-plus'
// 1.定义account数据
const labelPosition = ref('right')
const formLabelAlign = reactive({
  label: '',
  password: ''
})
// 2.定义校验规则
const accountRules: FormRules = {
  name: [
    { required: true, message: '必须输入帐号信息~', trigger: 'blur' }
  ]
}
const showPassword = ref(true)
function translateShow() {
  showPassword.value = !showPassword.value
}
</script>
<style lang="less" scoped>
.pane-phone {}
</style>
