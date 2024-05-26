<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "修改密码",
  },
}
</route>

<template>
  <view class="password-page p-2">
    <wd-form ref="form" :model="params">
      <wd-card custom-class="card-css">
        <wd-cell-group border>
          <wd-input
            label="旧密码"
            label-width="100px"
            prop="old_password"
            clearable
            v-model="params.old_password"
            placeholder="请输入旧密码"
            :rules="[{ required: true, message: '请填写旧密码' }]" />
          <wd-input
            label="密码"
            label-width="100px"
            prop="password"
            show-password
            clearable
            v-model="params.password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
          <wd-input
            label="确认密码"
            label-width="100px"
            prop="password_confirm"
            show-password
            clearable
            v-model="params.password_confirm"
            placeholder="请再填写一遍密码"
            :rules="[{ required: true, message: '请再填写一遍密码' }]" />
        </wd-cell-group>
      </wd-card>
    </wd-form>
    <view class="page-footer">
      <wd-button block @click="updatedPassword">修改密码</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Toast } from "@/utils/utils";
import { changePassWorld } from "@/service/my";
import { md5 } from "js-md5";
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----变量等------------------------------------------------------------------
const form = ref<any>();
const params = ref<any>({
  old_password: "",
  password: "",
  password_confirm: "",
});
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
function updatedPassword() {
  form.value
    .validate()
    .then(({ valid }) => {
      if (valid) {
        if (params.value.password !== params.value.password_confirm) {
          Toast("两次密码不一致");
          return;
        }
        const data = {
          old_password: md5(params.value.old_password),
          password: md5(params.value.password),
          password_confirm: md5(params.value.password_confirm),
        };
        changePassWorld(data).then((res: any) => {
          if (res.code === 1) {
            Toast("修改成功", function () {
              uni.navigateBack();
            });
          } else {
            Toast(res.msg);
          }
        });
      }
    })
    .catch(() => {});
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------

// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.password-page {
  :deep(.card-css) {
    margin: 0.25rem 0.25rem 0.5rem !important;
  }
}
</style>
