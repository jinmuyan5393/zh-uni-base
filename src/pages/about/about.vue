<route lang="json5">
{
  style: {
    navigationBarTitleText: "关于",
  },
}
</route>

<template>
  <view class="bg-white overflow-hidden pt-2 px-4" :style="{ marginTop: safeAreaInsets?.top + 'px' }">
    <view class="text-center text-3xl mt-8">
      鸽友们好，我是
      <text class="text-red-500">菲鸽</text>
    </view>
    <tn-icon name="logo-tuniao" type="primary" />
    <tn-icon name="logo-tuniao" type="success" />
    <tn-icon name="logo-tuniao" type="danger" />
    <tn-icon name="logo-tuniao" type="warning" :custom-style="{ fontSize: '20px' }" />

    <tn-icon name="logo-tuniao" color="tn-blue" />

    <tn-icon name="https://tnuiimage.tnkjapp.com/logo/tuniao.png" />

    <tn-tag type="primary">标签</tn-tag>
    <tn-tag type="success">标签</tn-tag>
    <tn-tag type="warning">标签</tn-tag>
    <tn-tag type="danger">标签</tn-tag>
    <RequestComp />
    <UploadComp />
  </view>
</template>

<script lang="ts" setup>
import RequestComp from "./components/request.vue";
import UploadComp from "./components/upload.vue";

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
</script>

<style lang="scss" scoped>
.test-css {
  // mt-4=>1rem=>16px;
  margin-top: 16px;
}
</style>
