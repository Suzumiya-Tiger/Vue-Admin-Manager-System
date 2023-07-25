<template>
  <div class="search" v-if="isQuery">
    <!-- 表单搜索部分 -->
    <el-form
      :model="searchForm"
      ref="formRef"
      :label-width="searchConfig.labelWidth ? searchConfig.labelWidth : '80px'"
      size="default"
    >
      <el-row :gutter="20">
        <template v-for="item in searchConfig.formItems" :key="item.prop">
          <el-col :span="item.span">
            <el-form-item :label="item.label" :prop="item.prop">
              <template v-if="item.type === 'input'">
                <el-input
                  v-model="searchForm[item.prop]"
                  :placeholder="item.placeholder"
                ></el-input>
              </template>
              <template v-else-if="item.type === 'date-picker'">
                <el-date-picker
                  v-model="searchForm[item.prop]"
                  type="daterange"
                  format="YYYY-MM-DD"
                  :range-separator="item.rangeSeparator"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  size="default"
                />
              </template>
              <template v-else-if="item.type === 'select'">
                <el-select
                  v-model="searchForm[item.prop]"
                  :placeholder="item.placeholder"
                  style="width: 100%"
                >
                  <template
                    v-for="itemOption in item.options"
                    :key="itemOption.value"
                  >
                    <el-option
                      :label="itemOption.label"
                      :value="itemOption.value"
                    ></el-option>
                  </template>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>

    <!-- 重置和搜索的按钮 -->
    <div class="btns">
      <el-button icon="Refresh" @click="handleResetClick">重置</el-button>
      <el-button type="primary" icon="Search" @click="handleQueryClick"
        >查询</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ElForm } from 'element-plus'
import usePermissions from '@/hooks/usePermissions'

// 1.在vue3中自定义发射事件
// 定义自定义事件/接收的属性

interface IProps {
  searchConfig: {
    pageName: string
    formItems: any[]
    labelWidth?: string
  }
}
const emit = defineEmits(['queryClick', 'resetClick'])
const props = defineProps<IProps>()

const isQuery = usePermissions(`${props.searchConfig.pageName}:query`)

// 定义form的数据
const initialForm: any = {}
for (const item of props.searchConfig.formItems) {
  initialForm[item.prop] = item.initialValue
}
const searchForm = reactive(initialForm)
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
