<template>
  <div class="main-menu">
    <!-- logo -->
    <div class="logo">
      <img class="img" src="@/assets/img/logo.svg" alt="">
      <h2 class="title">春日管理系统</h2>
    </div>
    <div class="menu">
      <!-- menu -->
      <el-menu default-active="2" text-color="#b7bdc3" active-text-color="#fff" background-color="#001529">
        <!-- 通过遍历后端传输数据的方式遍历整个菜单 -->
        <template v-for="item in userMenus" :key="item.id">
          <!-- 通过index标识来使得展开收缩只使对应模块起效果 -->
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <el-icon>
                <!-- 动态组件component 可通过is选取生成对应的组件 -->
                <component :is="item.icon.split('-icon-')[1]"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="subitem in item.children" :key="subitem.id">
              <el-menu-item :index="subitem.id + ''">
                {{ subitem.name }}
              </el-menu-item>
            </template>
          </el-sub-menu>

        </template>

      </el-menu>

    </div>
    
  </div>
</template>

<script setup lang="ts">
import useLoginStore from '@/store/login/login';
// 1.获取动态的菜单
const loginStore = useLoginStore()
const userMenus = loginStore.userMenus
console.log(userMenus)
</script>

<style lang="less" scoped>
.main-menu {
  height: 100%;
  background-color: #001529;
}

.logo {
  display: flex;
  height: 28px;
  padding: 12px 10px 8px 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;

  .img {
    height: 100%;
    margin: 0 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    color: white;
    white-space: nowrap;
  }
}

.el-menu {
  border-right: none;
  user-select: none;
}

.el-sub-menu {
  .el-menu-item {
    padding-left: 50px !important;
    background-color: #0c2135;
  }

  .el-menu-item:hover {
    color: #fff;
  }

  .el-menu-item.is-active {
    background-color: #0a60bd;
  }
}
</style>