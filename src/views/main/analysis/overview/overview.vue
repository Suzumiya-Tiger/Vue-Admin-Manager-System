<template>
  <div class="overview">
    <el-container>
      <el-header class="headers">
        <div class="front-desc">
          <div class="left">
            <p>
              前端构建git仓库:
              <a
                style="cursor: pointer; color: blue"
                href="https://github.com/Suzumiya-Tiger/Vue-Admin-Manager-System"
                target="_blank"
                >点击跳转</a
              >
            </p>
            <p>选用技术栈：Vue3 Pinia Axios TypeScript Vite</p>
            <p>图形框架或UI库：element-plus Echart vanta</p>
          </div>
          <div class="right">
            <p>
              后端服务器git仓库:
              <a
                style="cursor: pointer; color: blue"
                href="https://github.com/Suzumiya-Tiger/LyokoHUB.git"
                target="_blank"
                >点击跳转</a
              >
            </p>
            <p>后端服务器技术栈： NodeJS Koa mySql</p>
          </div>
        </div>
        <div class="skeleton">
          <p>
            这是一套具备模块化开发体系和快速复用开发特性的后台管理系统，具备设计完善的鉴权体系和路由管理，同时readMe文档配有详略的配置教学和讲解，您仅需配置mock数据或service下的config配置，即可为您提供开箱即用的体验。
          </p>
        </div>
      </el-header>
      <el-main class="main">
        <div id="banner">
          <div class="an">
            <div class="maxCon">
              <div class="description">
                <p>
                  如果您喜欢本项目，恳请在github中为本项目点亮⭐️，感激不尽。
                </p>
                <p style="font-size: 22px">项目介绍：</p>
                <p>
                  ⚡ 本项目基于RBAC(role based access
                  control)原则对用户的权限进行约束和控制，路由管理和功能均受登录用户的角色类型进行展示或控制。
                </p>
                <p>
                  ⚡
                  本项目基于fetch请求原则对axios进行了合理的封装，您可以使用任一的fetch
                  API或者对单独的请求进行拦截器定制。
                </p>
                <p>
                  ⚡
                  本项目利用高阶组件的特性对业务模块进行了封装，您也可以使用自定义具名插槽完成进一步拓展，进而利用hooks和对应的业务组件快速迭代开发。
                </p>
                <p>
                  ⚡
                  本项目的关键状态数据的存储和网络请求的调用绝大多数都在pinia中进行完成，同时利用pinia完成了高复用性的接口请求设计和用户登录逻辑的交互开发。
                </p>
                <p>
                  ⚡
                  本项目的readme文档包含了条分缕析的模块讲解和代码剖析，并且拥有分类健全的大纲，如果您有不甚理解的内容，欢迎查阅本项目的readme文档。
                </p>
              </div>
              <div class="rtMove">
                <img class="tuB" src="@/assets/images/overview/tuB.png" />
                <img class="guangA" src="@/assets/images/overview/guang.png" />
                <img class="guangB" src="@/assets/images/overview/guang.png" />
                <img class="tuC" src="@/assets/images/overview/tuC.png" />

                <img class="lingxA" src="@/assets/images/overview/lingxA.png" />
                <img class="lingxB" src="@/assets/images/overview/lingxB.png" />
                <img class="lingxC" src="@/assets/images/overview/lingxC.png" />
                <img class="lingxD" src="@/assets/images/overview/lingxD.png" />
                <img class="lingxE" src="@/assets/images/overview/lingxE.png" />
                <img class="lingxF" src="@/assets/images/overview/lingxF.png" />

                <img class="chaunB" src="@/assets/images/overview/chaunB.png" />
                <img class="chaunC" src="@/assets/images/overview/chaunB.png" />
                <img class="tuA" src="@/assets/images/overview/tuA.png" />
                <img class="tuAa" src="@/assets/images/overview/tuA.png" />

                <img class="ziA" src="@/assets/images/overview/ziA.png" />
                <img class="ziB" src="@/assets/images/overview/ziB.png" />
                <img class="ziC" src="@/assets/images/overview/ziC.png" />

                <img class="ma tuAn" src="@/assets/images/overview/tuAn.png" />
                <img
                  class="ma tuMing"
                  src="@/assets/images/overview/tuMing.png"
                />

                <img class="ren" src="@/assets/images/overview/ren.png" />
              </div>
            </div>
          </div></div
      ></el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import '@/assets/css/viewCpns/overview/index.less';
.overview {
  width: 100%;
  height: 100%;
}
.el-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.headers {
  position: relative;
  height: auto;
  padding: 0;
  width: 100%;

  .front-desc {
    display: flex;
    padding: 0;
    justify-content: space-around;
    flex-wrap: nowrap;
    background: linear-gradient(
      to bottom right,
      rgb(5, 5, 30),
      rgb(82, 80, 80)
    );
    height: 140px;
    width: 100%;
    margin-bottom: 2px;
    border-radius: 5px;
  }
  .skeleton {
    width: 100%;
    height: 50px;
    background: linear-gradient(
      to bottom right,
      rgb(124, 124, 203),
      rgb(155, 153, 153)
    );
    margin-bottom: 2px;
    border-radius: 5px;
  }
  p {
    color: #fff;
    padding: 8px 20px;
    font-size: 16px;
  }
}
.main {
  flex: 1;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  position: relative;
}
#banner {
  .description {
    min-width: 330px;
    max-width: 520px;
    color: #fff;
    p {
      line-height: 1.5;
      font-size: 16px;
      padding: 6px 10px;
      padding-right: 0;
    }
  }
  width: 100%;
  height: 100%;
  right: 0;
  left: 0;
  top: 0;
  z-index: 1;
  background-image: url(@/assets/images/overview/banbj.jpeg);
  border-radius: 4px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.maxCon {
  height: 500px;
  width: 100%;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;

  display: flex;
  .description {
    padding-top: 20px;
  }
}
/* 动画的舞台 */
.rtMove {
  width: 444px;
  height: 430px;
  position: absolute;
  right: 70px;
  top: 40px;
  background-image: url(@/assets/images/overview/banner.png);
  background-position: center bottom;
  background-repeat: no-repeat;
}

/* 动画的子元素 */
.rtMove .tuC {
  position: absolute;
  top: 228px;
  left: 168px;
  opacity: 1;
  animation: tuC 1.6s linear infinite;
}

.rtMove .tuB {
  position: absolute;
  top: 123px;
  left: 111px;
  animation: tuB 2s linear infinite;
}

.rtMove .guangA {
  position: absolute;
  top: 309px;
  left: 279px;
  animation: guangA 1.3s linear infinite;
}

.rtMove .guangB {
  position: absolute;
  top: 263px;
  left: 239px;
  animation: guangB 1.1s linear infinite;
}

.rtMove .lingxA {
  position: absolute;
  top: 194px;
  left: 126px;
  opacity: 1;
  animation: lingxA 2s linear infinite;
}

.rtMove .lingxB {
  position: absolute;
  top: 163px;
  left: 79px;
  opacity: 1;
  animation: lingxB 2.2s linear infinite;
}

.rtMove .lingxC {
  position: absolute;
  top: 179px;
  left: 189px;
  opacity: 1;
  animation: lingxC 1.7s linear infinite;
}

.rtMove .lingxD {
  position: absolute;
  top: 103px;
  left: 160px;
  opacity: 1;
  animation: lingxC 2.7s linear infinite;
}

.rtMove .lingxE {
  position: absolute;
  top: 104px;
  left: 95px;
  opacity: 1;
  animation: lingxB 1.2s linear infinite;
}

.rtMove .lingxF {
  position: absolute;
  top: 84px;
  left: 144px;
  opacity: 1;
  animation: lingxA 1.4s linear infinite;
}

.rtMove .chaunB {
  position: absolute;
  top: 38px;
  left: 318px;
  animation: chaunB 1.2s linear infinite;
}

.rtMove .chaunC {
  position: absolute;
  top: 60px;
  left: 318px;
  animation: chaunC 0.7s linear infinite;
}

.rtMove .tuA {
  position: absolute;
  top: 140px;
  left: 316px;
  animation: tuA 1.3s linear infinite;
}

.rtMove .tuAa {
  position: absolute;
  top: 140px;
  left: 316px;
  animation: tuAa 1.3s linear infinite;
}

.rtMove .ziA {
  position: absolute;
  top: 114px;
  left: 320px;
  animation: ziA 2.6s linear infinite;
}

.rtMove .ziB {
  position: absolute;
  top: 144px;
  left: 339px;
  animation: ziB 2s linear infinite;
}

.rtMove .ziC {
  position: absolute;
  top: 91px;
  left: 349px;
  animation: ziC 1.7s linear infinite;
}

.rtMove .ma {
  position: absolute;
  top: 247px;
  left: 303px;
}

.rtMove .tuMing {
  opacity: 0;
  animation: tuMing 0.6s linear infinite;
}

.rtMove .ren {
  position: absolute;
  top: 283px;
  left: 330px;
}
</style>
