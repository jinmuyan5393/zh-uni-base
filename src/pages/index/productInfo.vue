<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "货物信息",
  },
}
</route>

<template>
  <view class="product-info py-2">
    <wd-form ref="formRef" :model="form" :rules="rules">
      <wd-card title="基础信息">
        <wd-input
          label="货物名称"
          custom-class="card-input"
          label-width="100px"
          prop="cargo_name"
          required
          clearable
          :maxlength="8"
          show-word-limit
          v-model="form.cargo_name"
          placeholder="请输入" />
        <wd-input
          label="货物数量"
          custom-class="card-input"
          label-width="100px"
          prop="cargo_quantity"
          type="number"
          required
          clearable
          v-model="form.cargo_quantity"
          placeholder="请输入" />
        <wd-input
          label="货物重量(吨)"
          custom-class="card-input"
          label-width="100px"
          type="digit"
          prop="cargo_weight"
          required
          clearable
          v-model="form.cargo_weight"
          placeholder="请输入" />
      </wd-card>
      <wd-card title="体积">
        <wd-input
          label="货物长度(m)"
          custom-class="card-input"
          label-width="100px"
          prop="cargo_length"
          type="digit"
          required
          clearable
          v-model="form.cargo_length"
          placeholder="请输入" />
        <wd-input
          label="货物宽度(m)"
          custom-class="card-input"
          label-width="100px"
          prop="cargo_width"
          type="digit"
          required
          clearable
          v-model="form.cargo_width"
          placeholder="请输入" />
        <wd-input
          label="货物高度(m)"
          custom-class="card-input"
          label-width="100px"
          type="digit"
          prop="cargo_height"
          required
          clearable
          v-model="form.cargo_height"
          placeholder="请输入" />
        <wd-input
          label="货物体积(m³)"
          label-width="100px"
          custom-class="card-input"
          prop="cargo_volume"
          type="digit"
          required
          disabled
          v-model="cargoVolume"
          placeholder="请输入" />
      </wd-card>
      <wd-card title="货物类型" custom-class="custom-card-required">
        <SelectBox :options="GOODS_TYPE" v-model="form.cargo_type" />
        <wd-input
          label="其他类型"
          label-width="100px"
          custom-class="card-input"
          v-if="form.cargo_type == 5"
          prop="cargo_desc"
          required
          clearable
          v-model="form.cargo_desc"
          placeholder="请输入" />
      </wd-card>
      <wd-card title="包装方式" custom-class="custom-card-required">
        <SelectBox :options="PACKAGE_TYPE" v-model="form.packaging_method" />
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
import { GOODS_TYPE, PACKAGE_TYPE } from "@/utils/dict";
import SelectBox from "@/components/SelectBox/SelectBox.vue";
const props = defineProps({
  formData: {
    type: String,
  },
});
const formRef = ref();
const form = ref({
  cargo_name: "",
  cargo_quantity: "",
  cargo_weight: "",
  cargo_length: "",
  cargo_width: "",
  cargo_height: "",
  cargo_volume: "",
  cargo_type: 1,
  cargo_desc: "",
  packaging_method: 1,
});

const rules = ref({
  cargo_name: [
    {
      required: true,
      message: "请输入货物名称",
      trigger: "blur",
    },
  ],
  cargo_quantity: [
    {
      required: true,
      message: "请输入货物数量",
      trigger: "blur",
    },
  ],
  cargo_weight: [
    {
      required: true,
      message: "请输入货物重量",
      trigger: "blur",
    },
  ],
  cargo_length: [
    {
      required: true,
      message: "请输入货物长度",
      trigger: "blur",
    },
  ],
  cargo_width: [
    {
      required: true,
      message: "请输入货物宽度",
      trigger: "blur",
    },
  ],
  cargo_height: [
    {
      required: true,
      message: "请输入货物高度",
      trigger: "blur",
    },
  ],
  cargo_type: [
    {
      required: true,
      message: "请输入货物类型",
      trigger: "change",
    },
  ],
  packaging_method: [
    {
      required: true,
      message: "请输入包装方式",
      trigger: "change",
    },
  ],
});

const cargoVolume = computed(() => {
  // eslint-disable-next-line camelcase
  const { cargo_length, cargo_width, cargo_height } = form.value;
  // eslint-disable-next-line camelcase
  if (!cargo_length || !cargo_width || !cargo_height) return 0;
  return (Number(cargo_length) * Number(cargo_width) * Number(cargo_height) || 0).toFixed(1);
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
      const info = {
        ...form.value,
        cargo_volume: cargoVolume,
      };
      prePage.$vm.setFormInfo && prePage.$vm.setFormInfo(info);
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

<style lang="scss">
.product-info {
  padding-bottom: 100rpx;
}
</style>
