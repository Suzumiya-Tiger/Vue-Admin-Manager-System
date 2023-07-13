<template>
  <div class="main-menu">
    <!-- logo -->
    <div class="logo">
      <img class="img" src="@/assets/img/logo.svg" alt="">
      <h2 v-show="!isFold" class="title">春日管理系统</h2>
    </div>
    <div class="menu">
      <!-- menu -->
      <el-menu :collapse-transition="false" :default-active="defaultActive" :collapse="isFold" text-color="#b7bdc3"
        active-text-color="#fff" background-color="#001529">
        <!-- 通过遍历后端传输数据的方式遍历整个路由映射表 -->
        <template v-for=" item  in  userMenus " :key="item.id">
          <!-- 通过index标识来使得展开收缩只使对应模块起效果 -->
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <el-icon>
                <!-- 动态组件component 可通过is选取生成对应的组件 -->
                <component :is="item.icon.split('-icon-')[1]"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <template v-for=" subitem  in  item.children " :key="subitem.id">
              <el-menu-item :index="subitem.id + ''" @click="handleItemClick(subitem)">
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
import { useRouter, useRoute } from 'vue-router';
import { defineProps, ref } from 'vue';
import { mapPathToMenu } from '@/utils/map-menus';
// 0 接收props
defineProps({
  isFold: {
    type: Boolean,
    default: false
  }
})
// 1.获取动态的路由映射表
const loginStore = useLoginStore()
// userMenus是从后端获取的路由映射表
const userMenus = loginStore.userMenus
// 2.监听item的点击
const router = useRouter()
function handleItemClick(item: any) {
  const url = item.url
  router.push(url)
}

// 3.ElMenu的默认菜单

// 获取当前路由
const route = useRoute()
// 匹配当前路由获取对应的id
const pathMenu = mapPathToMenu(route.path, userMenus)
const defaultActive = ref(pathMenu.id + '')
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