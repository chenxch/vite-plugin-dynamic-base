<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  document.querySelector('.test')!.innerHTML='test innerHTML="test"'
})
</script>
<template>
  About
  <img src="../assets/logo.png">
  <div class="test"></div>
  <div class="about"></div>
  <div class="base"></div>
</template>
<style scoped>
@import url("../assets/styles/base.css");

.test ::after {
  /* 会改变打包后innerHTML插入的引号 */
  content:"1"
  /* content:"" */
}
.about{
  width: 100px;
  height: 100px;
  background-image: url("../assets/logo.png");
}
.about2{
  width: 100px;
  height: 100px;
  background-image: url("../assets/logo.png");
}
</style>
