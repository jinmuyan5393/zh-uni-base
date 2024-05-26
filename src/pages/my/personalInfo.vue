<!--
 * @Date: 2024-04-26 15:47:43
 * @LastEditTime: 2024-05-17 09:33:56
 * @Description:
-->
<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "个人信息",
  },
}
</route>

<template>
  <view class="personal-info">
    <wd-form ref="formRef" :model="params" custom-class="m-2 mb-20" :rules="rules">
      <wd-card title="基础资料" custom-class="card-css">
        <wd-cell-group border>
          <view class="avatar-box">
            <view style="margin-left: 25rpx; color: #000">头像</view>
            <wd-img width="100rpx" height="100rpx" round custom-class="avatar" :src="params.avatar" @click="chooseAvatar" />
          </view>
          <wd-input label="用户名" label-width="200rpx" prop="account" clearable v-model="params.account" placeholder="请输入用户名" />
          <wd-input
            label="联系方式"
            label-width="200rpx"
            prop="profile.phone"
            clearable
            v-model="params.profile.phone"
            placeholder="请输入联系方式" />
          <wd-picker
            :columns="[
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]"
            label="性别"
            prop="sex"
            v-model="params.profile.sex" />
        </wd-cell-group>
      </wd-card>
      <wd-card title="身份证" custom-class="card-css">
        <wd-cell-group border>
          <wd-input label="姓名" label-width="200rpx" prop="name" clearable v-model="params.profile.id_card_name" placeholder="请输入" />
          <wd-input label="证件号" label-width="200rpx" prop="profile.id_card" clearable v-model="params.profile.id_card" placeholder="请输入" />
          <wd-datetime-picker v-model="params.profile.id_card_expired" label="到期时间" type="date" />
          <uploadLicense v-model:frontImg="params.profile.id_card_front_face" v-model:backImg="params.profile.id_card_back_face" />
        </wd-cell-group>
      </wd-card>
    </wd-form>
    <view class="page-footer">
      <wd-button block @click="save">保存</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import uploadLicense from "@/components/uploadLicense/uploadLicense.vue";
import { centerAPI, editSelfAPI, fileAPI } from "@/service/my";
import { Toast, getFileUrl } from "@/utils/utils";
import { phoneValidate, idCardValidate } from "@/utils/validate";
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----变量等------------------------------------------------------------------
const rules = ref<any>({
  "profile.phone": [
    {
      required: true,
      message: "请输入联系方式",
      trigger: "blur",
    },
    {
      validator: phoneValidate,
      message: "请输入正确的手机号",
      key: "phone",
    },
  ],
  "profile.id_card": [
    {
      required: false,
      message: "请输入身份证号",
      trigger: "blur",
    },
    {
      validator: idCardValidate,
      message: "请输入正确的身份证号",
    },
  ],
});
const formRef = ref<any>();
const params = ref<any>({
  account: "张三",
  avatar: "",
  profile: {
    admin_id: 15,
    email: null,
    id: 14,
    id_card: null,
    id_card_back_face: null,
    id_card_expired: "",
    id_card_front_face: null,
    id_card_name: null,
    phone: "1773237733",
    sex: 1,
    update_time: null,
  },
});

// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
onMounted(() => {
  getInfo();
});
function getInfo() {
  centerAPI().then((res: any) => {
    if (res.code === 1) {
      res.data.profile.id_card_expired = res.data.profile.id_card_expired + "000";
      params.value = res.data;
    }
  });
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
/** 换头像 */
function chooseAvatar() {
  uni.chooseImage({
    count: 1, // 默认9
    success: res => {
      const uploadParams = {
        type: 10,
        cid: 0,
      };
      fileAPI(res.tempFiles[0].path, uploadParams).then((res: any) => {
        if (res.code === 1) {
          params.value.avatar = getFileUrl(res.data.url);
        }
      });
    },
  });
}
// 保存
function save() {
  formRef.value.validate().then(({ valid, errors }) => {
    if (valid) {
      const data = JSON.parse(JSON.stringify(params.value));
      data.profile.id_card_expired = data.profile.id_card_expired ? String(data.profile.id_card_expired).slice(0, -3) : "";
      editSelfAPI(data).then((res: any) => {
        if (res.code === 1) {
          Toast("保存成功", function () {
            uni.navigateBack();
          });
        } else {
          Toast("保存失败");
        }
      });
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
.personal-info {
  .avatar-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :deep(.avatar) {
    margin-right: 20rpx;
    border: 2rpx solid #dd5757;
  }

  :deep(.card-css) {
    margin: 0.25rem 0.25rem 0.5rem !important;
  }

  .card-face {
    width: 250rpx;
    height: 150rpx;
    background-color: #000;
  }
}
</style>
