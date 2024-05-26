<!--
 * @Date: 2024-04-19 16:24:20
 * @LastEditTime: 2024-04-19 16:43:27
 * @Description:
-->
<template>
  <view class="default-layout">
    <slot />
  </view>
</template>
<style lang="scss">
.default-layout {
  height: 100vh;
  overflow: auto;
  background: #f2f2f2;
}
</style>
