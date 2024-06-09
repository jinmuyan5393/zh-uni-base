<!--
 * @Description: 统计页面
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-16 16:10:29
-->
<template>
  <div class="home bg-white h-full p-[10px] rounded-lg overflow-auto">
    首页 --{{ num }}--
    <el-button @click="changeLocal">变更</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storageLocal } from "@zhonghe/utils";
storageLocal.setItem("num", 123);
const num = computed(() => {
  return storageLocal.getItem("num");
});

function changeLocal() {
  storageLocal.setItem("num", Math.random() * 100);
}
</script>

<style lang="scss" scoped>
.home {
}
</style>
