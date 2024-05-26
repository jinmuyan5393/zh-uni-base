<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "其他信息",
  },
}
</route>

<template>
  <view class="other-info py-2">
    <wd-form ref="formRef" :model="form" :rules="rules">
      <wd-card title="时间信息">
        <wd-datetime-picker
          required
          prop="loading_appointment_time"
          label-width="120px"
          :default-value="defaultTime"
          v-model="form.loading_appointment_time"
          label="预约装货时间" />
        <wd-datetime-picker
          required
          prop="expected_arrival_time"
          label-width="120px"
          :default-value="defaultTime"
          v-model="form.expected_arrival_time"
          label="预期到货时间" />
      </wd-card>
      <wd-card title="费用信息">
        <wd-input
          label="代收货款(元)"
          label-width="100px"
          prop="cash_on_delivery"
          type="digit"
          required
          clearable
          custom-class="card-input"
          v-model="form.cash_on_delivery"
          placeholder="请输入" />
        <wd-input label="手续费(1%)" label-width="100px" custom-class="card-input" required disabled v-model="fee" placeholder="手续费" />
      </wd-card>
      <wd-card title="付款方式" custom-class="custom-card-required">
        <SelectBox :options="PAYMENT_TYPE" v-model="form.payment_method" />
      </wd-card>
      <wd-card title="备注" custom-class="custom-card-required">
        <wd-textarea
          prop="remark"
          custom-class="custom-textarea"
          v-model="form.remark"
          required
          :maxlength="200"
          clearable
          show-word-limit
          placeholder="请输入" />
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
import { ref, onMounted, nextTick, computed } from "vue";
import { PAYMENT_TYPE } from "@/utils/dict";
const props = defineProps({
  formData: {
    type: String,
  },
});
const formRef = ref();
const form = ref({
  loading_appointment_time: "",
  expected_arrival_time: "",
  payment_method: 1,
  cash_on_delivery: "",
  remark: "",
});

const defaultTime = ref(Date.now());

// 手续费
const fee = computed(() => {
  const cash = isNaN(Number(form.value.cash_on_delivery)) ? 0 : Number(form.value.cash_on_delivery);
  return (cash * 0.01).toFixed(2);
});

const rules = ref({
  loading_appointment_time: [
    {
      required: true,
      message: "请选择预约装货时间",
      trigger: "change",
    },
  ],
  expected_arrival_time: [
    {
      required: true,
      message: "请选择预期到货时间",
      trigger: "change",
    },
  ],
  payment_method: [
    {
      required: true,
      message: "请选择支付方式",
      trigger: "change",
    },
  ],
  cash_on_delivery: [
    {
      required: true,
      message: "请输入代收货款",
      trigger: "blur",
    },
  ],
  remark: [
    {
      required: true,
      message: "请输入备注",
      trigger: "blur",
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
.other-info {
  padding-bottom: 120rpx;
  background: #f2f2f2;
}
</style>
