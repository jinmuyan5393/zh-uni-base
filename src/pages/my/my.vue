<!--
 * @Date: 2024-04-23 10:37:44
 * @LastEditTime: 2024-04-28 17:45:41
 * @Description:
-->
<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "个人中心",
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="my-info">
    <view class="flex items-center w-full h-20vh" style="background: linear-gradient(to right, #3a7cc5, #4f9bdb, #64b5f5, #79d0ff)">
      <view class="pl-5 flex">
        <wd-img width="150rpx" height="150rpx" round :src="params.avatar" custom-class="avatar" />
        <view class="pl-5 pt-3">
          <view style="color: #fff">{{ params.account }}</view>
          <view class="pt-1" style="color: #fff">{{ params.profile.phone }}</view>
        </view>
      </view>
    </view>
    <view class="p-2">
      <wd-cell custom-class="mb-2 b-rd-lg" title="个人资料" is-link to="/pages/my/personalInfo">
        <template #icon>
          <view class="pr-2">
            <wd-icon name="user" color="#0083ff" size="34rpx" custom-style="font-weight: 600;" />
          </view>
        </template>
      </wd-cell>
      <wd-cell custom-class="mb-2 b-rd-lg" title="修改密码" is-link to="/pages/my/password">
        <template #icon>
          <view class="pr-2">
            <wd-icon name="lock-on" color="#0083ff" size="34rpx" custom-style="font-weight: 600;" />
          </view>
        </template>
      </wd-cell>
      <wd-cell custom-class="mb-2 b-rd-lg" title="用户协议" is-link to="/pages/my/userAgreement">
        <template #icon>
          <view class="pr-2">
            <wd-icon name="books" color="#D19A66" size="34rpx" custom-style="font-weight: 600;" />
          </view>
        </template>
      </wd-cell>
      <wd-cell custom-class="mb-2 b-rd-lg" title="隐私条款" is-link to="/pages/my/privacyPolicy">
        <template #icon>
          <view class="pr-2">
            <wd-icon name="spool" color="#21D86D" size="34rpx" custom-style="font-weight: 600;" />
          </view>
        </template>
      </wd-cell>
    </view>
    <view class="page-footer">
      <wd-button block v-if="!userStore.isLogined" @click="jumpToPage">登录</wd-button>
      <wd-button block v-if="userStore.isLogined" @click="logOut">退出登录</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onPullDownRefresh } from "@dcloudio/uni-app";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store";
import userImg from "@/static/images/user.png";
import { centerAPI } from "@/service/my";
import { getFileUrl, Toast } from "@/utils/utils";
import { Console } from "console";
/// ///////////////////////////////////////////////////////////////////////////////
const userStore = useUserStore();
// #region ----变量等------------------------------------------------------------------
const params = ref<any>({
  avatar: "",
  account: "",
  profile: {
    phone: "",
  },
});
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
/** 下拉刷新 */
onPullDownRefresh(() => {
  getInfo();
  setTimeout(function () {
    uni.stopPullDownRefresh();
  }, 1000);
});
onMounted(() => {
  getInfo();
});
function getInfo() {
  centerAPI().then((res: any) => {
    if (res.code === 1) {
      res.data.avatar = res.data.avatar ? getFileUrl(res.data.avatar) : userImg;
      params.value = res.data;
    }
  });
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------
/** 跳转页面 */
function jumpToPage() {
  uni.reLaunch({
    url: "/pages/login/login",
  });
}
/** 退出登录 */
function logOut() {
  Toast("退出登录", () => {
    userStore.clearUserInfo();
    uni.reLaunch({
      url: "/pages/login/login",
    });
  });
}
// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.my-info {
  :deep(.avatar) {
    border: 2rpx solid #fff;
  }
  .page-footer {
    background-color: transparent;
  }
}
</style>
