<template>
  <div>
    <div class="file-item relative" :style="{ height: height || fileSize, width: width || fileSize }">
      <el-image class="image" v-if="type == 'image'" fit="contain" :src="fileUrl" />
      <video class="video" v-else-if="type == 'video'" :src="fileUrl" />
      <el-image class="image" v-else src="https://img95.699pic.com/element/40103/3946.png_860.png" />
      <div
        v-if="type == 'video'"
        class="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-full w-5 h-5 flex justify-center items-center bg-[rgba(0,0,0,0.3)]">
        <baseIcon name="el-icon-CaretRight" :size="18" color="#fff" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
const baseUrl = import.meta.env.VITE_IMG_URL;
export default defineComponent({
  props: {
    // 图片地址
    uri: {
      type: String,
      default: "",
    },
    // 图片尺寸
    fileSize: {
      type: String,
      default: "100px",
    },
    // 选择器尺寸-宽度（不传则是使用size
    width: {
      type: String,
      default: "",
    },
    // 选择器尺寸-高度（不传则是使用size
    height: {
      type: String,
      default: "",
    },
    // 文件类型
    type: {
      type: String,
      default: "image",
    },
  },
  emits: ["close"],
  computed: {
    // 获取文件类型
    fileUrl() {
      if (this.uri && (this.uri.startsWith("http") || this.uri.startsWith("https"))) {
        return this.uri;
      } else {
        return `${baseUrl}/${this.uri}`;
      }
    },
  },
});
</script>

<style scoped lang="scss">
.file-item {
  box-sizing: border-box;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  @apply border;
  .image,
  .video {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
}
</style>
