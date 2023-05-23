<template>
  <div class="pane-phone">
    <el-form :label-position="labelPosition" label-width="40px" :model="formLabelAlign" style="max-width: 460px">
      <el-form-item label="用户">
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
            测试
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
const labelPosition = ref('right')
const formLabelAlign = reactive({
  label: '',
  password: ''
})
const showPassword = ref(true)
function translateShow() {
  showPassword.value = !showPassword.value
}
</script>
<style lang="less" scoped>
.pane-phone {}
</style>
