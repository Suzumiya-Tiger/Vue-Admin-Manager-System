<template>
  <div class="panel-phone">
    <el-form :rules="accountRules" :label-position="labelPosition" label-width="70px" :model="formLabelAlign"
      style="max-width: 460px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formLabelAlign.phone"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <div class="verify-code">
          <el-input v-model="formLabelAlign.password">
          </el-input>
          <el-button type="primary" class="get-btn">获取验证码</el-button>
        </div>

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
  phone: '',
  password: ''
})
// 2.定义校验规则
const accountRules: FormRules = {
  phone: [
    { required: true, message: '必须输入手机号', trigger: 'blur' }
  ]
}
const showPassword = ref(true)

</script>
<style lang="less" scoped>
.panel-phone {
  .verify-code {
    display: flex;

    .get-btn {
      margin-left: 8px;
    }
  }


}
</style>
