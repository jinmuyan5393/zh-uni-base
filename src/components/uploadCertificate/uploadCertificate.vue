<!--
 * @Date: 2024-04-28 11:54:27
 * @LastEditTime: 2024-04-28 16:59:59
 * @Description:证件上传
-->
<template>
  <view class="upload-certificate">
    <view class="certificate" @click="uploadChange1">
      <image :src="front" />
      <view class="upload-icon" v-if="!props.cardImg.front">
        <wd-icon name="cloud-upload" size="80rpx"></wd-icon>
      </view>
    </view>
    <view class="certificate" @click="uploadChange2">
      <image :src="back" />
      <view class="upload-icon" v-if="!props.cardImg.back">
        <wd-icon name="cloud-upload" size="80rpx"></wd-icon>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import sfzZ from "./images/sfz-z-1.png";
import sfzF from "./images/sfz-f-1.png";
import { fileAPI } from "@/service/my";
import { getFileUrl } from "@/utils/utils";
/// ///////////////////////////////////////////////////////////////////////////////
defineOptions({
  name: "uploadCertificate",
});
// #region ----变量等------------------------------------------------------------------
const props = defineProps({
  cardImg: {
    type: Object as any,
    default: () => {
      return {
        front: sfzZ,
        back: sfzF,
      };
    },
  },
});

const emits = defineEmits(["update:cardImg"]);
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------

const front = computed(() => {
  if (props.cardImg.front !== "") {
    return props.cardImg.front;
  }
  return sfzZ;
});
const back = computed(() => {
  if (props.cardImg.back !== "") {
    return props.cardImg.back;
  }
  return sfzF;
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
/** 上传图片1 */
function uploadChange1() {
  uni.chooseImage({
    count: 1, // 默认9
    success: res => {
      const uploadParams = {
        type: 10,
        cid: 0,
      };
      fileAPI(res.tempFiles[0].path, uploadParams).then((res: any) => {
        if (res.code === 1) {
          emits("update:cardImg", { front: getFileUrl(res.data.url), back: props.cardImg.back });
        }
      });
    },
  });
}

function uploadChange2() {
  uni.chooseImage({
    count: 1, // 默认9
    success: res => {
      const uploadParams = {
        type: 10,
        cid: 0,
      };
      fileAPI(res.tempFiles[0].path, uploadParams).then((res: any) => {
        if (res.code === 1) {
          emits("update:cardImg", { front: props.cardImg.front, back: res.data.uri });
        }
      });
    },
  });
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------

// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.upload-certificate {
  width: 100%;
  height: 100%;
  color: #484848;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  .certificate {
    box-sizing: border-box;
    border: 3rpx dashed #bab4b4;
    padding: 6rpx;
    flex: 1;
    width: 100%;
    position: relative;
    .upload-icon {
      position: absolute;
      left: calc(50% - 40rpx);
      top: calc(50% - 40rpx);
    }
  }
}
</style>
