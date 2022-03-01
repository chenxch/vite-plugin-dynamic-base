<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
// const locales = import.meta.globEager("./locale/*.json")
const locales2 = import.meta.glob("./locale/*.json")
// console.log(locales)
console.log(locales2)

</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <img alt="Vue logo" src="./assets/logo2.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <h1>Hello App!</h1>
  <p>
    <!--使用 router-link 组件进行导航 -->
    <!--通过传递 `to` 来指定链接 -->
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
    <router-link to="/basic">Go to Basic</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <div>
    
  <router-view></router-view>
  </div>
</template>

<style>
@import url("./assets/styles/base.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
