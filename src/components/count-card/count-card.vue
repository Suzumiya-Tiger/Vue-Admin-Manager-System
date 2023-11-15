src/components/count-card/count-card.vue
<template>
  <div class="count-card">
    <div class="header">
      <span>{{ title }}</span>

      <el-tooltip effect="light" :content="tips" placement="top-start">
        <el-icon>
          <Warning />
        </el-icon>
      </el-tooltip>
    </div>
    <div class="content">
      <span class="count1Ref" ref="count1Ref"> {{ number1 }}</span>
      <div class="footer">
        <span ref="count2Ref">{{ title }}:{{ number2 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CountUp } from 'countup.js'
import type { IProps } from './type'
const props = withDefaults(defineProps<IProps>(), {
  title: '商品总销量',
  tips: '所有商品总销量',
  number1: 0,
  number2: 0,
  amount: '',
  subtitle: ''
})
// 创建CountUp的实例对象
const count1Ref = ref<HTMLElement>()
const count2Ref = ref<HTMLElement>()
const countOption = {
  prefix: props.amount === 'saleroom' ? '￥' : ''
}
onMounted(() => {
  // 参数一：执行动画的元素
  // 参数二：数字增加至指定数值
  // 等待DOM渲染完成以后再进行动画的执行选项
  const countup1 = new CountUp(count1Ref.value!, props.number1, countOption)
  const countup2 = new CountUp(count2Ref.value!, props.number2, countOption)
  countup2.start()
  countup1.start()
})
</script>

<style lang="less" scoped>
.count-card {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: 130px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .header {
    display: flex;
    height: 38px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    justify-content: space-between;
    align-items: flex-end;
  }
  .content {
    display: flex;
    margin-left: 0px;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.85);
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .footer {
    margin-top: 5px;
    width: 100%;
    display: flex;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    letter-spacing: 1px;
    color: rgba(0, 0, 0, 0.85);
    border-top: 1px solid #f0f0f0;
  }
}
</style>
