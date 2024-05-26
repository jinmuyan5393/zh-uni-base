<!--
 * @Date: 2024-04-28 11:54:27
 * @LastEditTime: 2024-05-17 09:32:56
 * @Description: 证件上传
-->
<template>
  <view class="upload-license">
    <view class="certificate" @click="uploadChange('front')">
      <view class="mb-1">{{ frontDesc }}</view>
      <view v-if="frontImg" class="card-img p-2">
        <image :src="front" class="w-full h-[170px]" />
      </view>
      <image v-else :src="defaultFrontSrc" class="w-full h-[170px] box-img" />
    </view>
    <view class="certificate" @click="uploadChange('back')">
      <view class="mb-1">{{ backDesc }}</view>
      <view v-if="backImg" class="card-img p-2">
        <image :src="back" class="w-full h-[172px]" />
      </view>
      <image v-else :src="defaultBackSrc" class="w-full h-[172px] box-img" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import defaultFront from "@/static/images/driver-front.png";
import defaultBack from "@/static/images/driver-back.png";
import { computed } from "vue";
import { fileAPI } from "@/service/my";
import { getFileUrl } from "@/utils/utils";
/// ///////////////////////////////////////////////////////////////////////////////
defineOptions({
  name: "uploadCertificate",
});
// #region ----变量等------------------------------------------------------------------
const props = defineProps({
  frontImg: {
    // 正面图
    type: String,
  },
  backImg: {
    // 反面图
    type: String,
  },
  frontDesc: {
    // 正面描述
    type: String,
    default: "身份证人像面",
  },
  backDesc: {
    // 反面描述
    type: String,
    default: "身份证国徽面",
  },
  defaultFrontSrc: {
    // 正面默认图片
    type: String,
    default: "/static/images/idcard-front.png",
  },
  defaultBackSrc: {
    // 反面默认图片
    type: String,
    default: "/static/images/idcard-back.png",
  },
});

const emits = defineEmits(["update:frontImg", "update:backImg"]);

const front = computed(() => {
  return getFileUrl(props.frontImg);
});

const back = computed(() => {
  return getFileUrl(props.backImg);
});
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
/** 上传图片1 */
function uploadChange(flag: string) {
  uni.chooseImage({
    count: 1, // 默认9
    success: res => {
      const uploadParams = {
        type: 10,
        cid: 0,
      };
      fileAPI(res.tempFiles[0].path, uploadParams).then((res: any) => {
        if (res.code === 1) {
          if (flag === "front") {
            emits("update:frontImg", res.data.url);
          } else {
            emits("update:backImg", res.data.url);
          }
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
.upload-license {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  width: 100%;
  height: 100%;
  color: #484848;

  .box-img {
    border: 5rpx dashed #ddd;
    border-radius: 25rpx;
  }

  .card-img {
    box-sizing: border-box;
    border: 5rpx dashed #ddd;
    border-radius: 25rpx;

    image {
      border-radius: 25rpx;
    }
  }
}
</style>
