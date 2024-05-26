<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "车辆信息",
  },
}
</route>

<template>
  <view class="car-info py-2">
    <wd-form ref="formRef" :model="form" :rules="rules">
      <wd-card title="车型" custom-class="custom-card-required">
        <SelectBox :options="CAR_TYPE" v-model="form.vehicle_model" />
      </wd-card>
      <wd-card title="车长" custom-class="custom-card-required">
        <SelectBox :options="CAR_LENGTH" v-model="form.vehicle_length" />
      </wd-card>
    </wd-form>
    <view class="page-footer">
      <wd-button block @click="handleSubmit">完成</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----变量等------------------------------------------------------------------
import { ref, onMounted } from "vue";
import { CAR_TYPE, CAR_LENGTH } from "@/utils/dict";
const props = defineProps({
  formData: {
    type: String,
  },
});
const formRef = ref();
const form = ref({
  vehicle_model: 1,
  vehicle_length: 1,
});

const rules = ref({
  vehicle_model: [
    {
      required: true,
      message: "请选择车型",
      trigger: "change",
    },
  ],
  vehicle_length: [
    {
      required: true,
      message: "请选择车长",
      trigger: "change",
    },
  ],
});
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
onMounted(() => {
  const data = props.formData ? JSON.parse(props.formData) : {};
  nextTick(() => {
    form.value = {
      ...form.value,
      ...data,
    };
  });
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
function handleSubmit() {
  formRef.value.validate().then(({ valid }) => {
    if (valid) {
      const pages = getCurrentPages();
      const prePage = pages[pages.length - 2];
      prePage.$vm.setFormInfo && prePage.$vm.setFormInfo(form.value);
      uni.navigateBack();
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
.car-info {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 100rpx;
  overflow: auto;
  background: #f2f2f2;

  .footer {
    position: fixed;
    bottom: 0rpx;
    box-sizing: border-box;
    width: 100%;
    padding: 20rpx;
    background: #fff;
  }
}
</style>
