<template>
  <div class="search">
    <el-form
      :model="searchForm"
      ref="formRef"
      label-width="80px"
      size="default"
    >
      <el-row :gutter="120">
        <el-col :span="8">
          <el-form-item prop="name" label="用户名">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="真实姓名" prop="realname">
            <el-input
              v-model="searchForm.realname"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="cellphone">
            <el-input
              v-model="searchForm.cellphone"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="状态" prop="enable">
            <el-select
              v-model="searchForm.enable"
              placeholder="请选择查询状态"
              style="width: 100%"
            >
              <el-option :key="1" label="启用" :value="1" />
              <el-option :key="2" label="禁用" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间" prop="createAt">
            <el-date-picker
              v-model="searchForm.createAt"
              type="daterange"
              format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="default"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="btns">
            <el-button icon="Refresh" @click="handleResetClick">重置</el-button>
            <el-button type="primary" icon="Search" @click="handleQueryClick"
              >查询</el-button
            >
          </div></el-col
        >
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ElForm } from 'element-plus'
interface searchFormType {
  name: string
  realname: string
  cellphone: string
  enable: number
  createAt: string[]
}
// 1.在vue3中自定义发射事件
const emit = defineEmits(['queryClick', 'resetClick'])
const searchForm: searchFormType = reactive({
  name: '',
  realname: '',
  cellphone: '',
  enable: 1,
  createAt: []
})
/* 重置表单 */
// 获取表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
function handleResetClick() {
  // 1.重置表单数据
  formRef.value?.resetFields()
  // 2.重新发送网络请求
  emit('resetClick', searchForm)
}
function handleQueryClick() {
  // 在这里执行已注册的发射事件
  emit('queryClick', searchForm)
}
</script>

<style lang="less" scoped>
.search {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;

  .el-form-item,
  .btns {
    padding: 15px 40px;
    margin-bottom: 0;
  }
}

.btns {
  text-align: right;
  padding: 0 50px 10px 0;
}
</style>
