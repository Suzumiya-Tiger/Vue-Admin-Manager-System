<template>
  <div class="login" ref="Area">
    <login-panel />
  </div>
</template>

<script setup lang="ts">
import LoginPanel from './c-cpns/login-panel.vue'
import NET from 'vanta/src/vanta.net.js'

import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
const Area = ref(null)
let vantaEffect: any = null
onMounted(() => {
  vantaEffect = NET({
    el: Area.value,
    THREE: THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x3f4bff
  })
})
onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})
</script>

<style lang="less" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

</style>
