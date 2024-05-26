<!--
 * @Date: 2024-04-25 10:06:03
 * @LastEditTime: 2024-05-21 14:20:06
 * @Description:
-->
<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "登录",
  },
}
</route>

<template>
  <view class="content">
    <view class="title">
      <text class="name">托运人端</text>
      <text class="sub-name">运输调度与控制平台</text>
    </view>
    <view class="form-box">
      <view class="row-input">
        <image class="icon" src="@/static/images/login31_phone.png"></image>
        <wd-input custom-class="input-class" v-model="account" placeholder="请输入账号" clearable />
      </view>
      <view class="row-input">
        <image class="icon" src="@/static/images/login31_password.png"></image>
        <wd-input custom-class="input-class" v-model="password" placeholder="请输入密码" clearable show-password />
      </view>
      <view class="menu-link">
        <text>忘记密码?</text>
      </view>
      <view class="login-btn" @click="login">立即登录</view>
      <view class="tip-link">
        还没有账号?
        <text>立即注册</text>
      </view>
    </view>
    <view class="shortcut">
      <view class="tips">
        <text class="line"></text>
        由 再飞信息 提供技术支持
        <text class="line"></text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { md5 } from "js-md5";
import { ref, nextTick } from "vue";
import { loginAPI } from "@/service/login";
import { useUserStore } from "@/store";
import { Toast } from "@/utils/utils";
/// ///////////////////////////////////////////////////////////////////////////////
const userStore = useUserStore();
const nodeEnv = import.meta.env.VITE_NODE_ENV;
// #region ----变量等------------------------------------------------------------------
const account = ref<string>("");
const password = ref<string>("");
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
onMounted(() => {
  if (nodeEnv === "development") {
    // 开发环境设置默认账号
    nextTick(() => {
      account.value = "stest001";
      password.value = "111111";
    });
  }
  // 判断是否登录
  if (userStore.isLogined) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  }
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
/** 登录 */
function login() {
  const params = {
    account: account.value,
    password: md5(password.value),
    terminal: 1,
  };
  loginAPI(params).then((res: any) => {
    if (res.code === 1) {
      userStore.setUserInfo(res.data);
      Toast("登录成功");
      setTimeout(() => {
        uni.switchTab({
          url: "/pages/index/index",
        });
      }, 1000);
    } else {
      Toast(res.msg);
    }
  });
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------

// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  background: #fff;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 20vh;
  padding-left: 60rpx;

  .name {
    font-size: 70rpx;
    font-weight: bold;
    line-height: 100rpx;
  }

  .sub-name {
    font-size: 45rpx;
    font-weight: bold;
    line-height: 80rpx;
    letter-spacing: 8rpx;
  }
}

.form-box {
  padding: 0rpx 60rpx;

  .row-input {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100rpx;
    margin: 50rpx 0rpx;
    border-radius: 12rpx;

    .icon {
      flex-shrink: 0;
      width: 35rpx;
      height: 35rpx;
      margin-right: 20rpx;
    }

    :deep(.input-class) {
      width: 100%;
    }

    input {
      flex: 1;
      font-size: 30rpx;
    }

    .sub-icon {
      flex-shrink: 0;
      width: 35rpx;
      height: 35rpx;
      margin-left: 20rpx;
    }
  }

  .menu-link {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 26rpx;
    color: #3750ff;
  }

  .login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    margin-top: 50rpx;
    font-size: 30rpx;
    color: #fff;
    letter-spacing: 5rpx;
    background-color: #3750ff;
    border-radius: 12rpx;
  }

  .tip-link {
    display: flex;
    justify-content: center;
    font-size: 26rpx;
    font-weight: bold;
    line-height: 150rpx;
    letter-spacing: 3rpx;

    text {
      padding-left: 10rpx;
      color: #3750ff;
    }
  }
}

.shortcut {
  display: flex;
  flex-direction: column;

  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    font-size: 26rpx;

    .line {
      width: 60rpx;
      height: 2rpx;
      margin: 0 40rpx;
      background-color: #dad9d9;
    }
  }

  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140rpx;

    image {
      width: 80rpx;
      height: 80rpx;
      margin: 0 40rpx;
    }
  }
}
</style>
