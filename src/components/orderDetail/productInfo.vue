<template>
  <view class="product-info">
    <wd-card title="基本信息">
      <wd-cell title="订单编号" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.sn }}</view>
        </template>
      </wd-cell>
      <wd-cell title="当前状态" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.statusLabel }}</view>
        </template>
      </wd-cell>
      <wd-cell title="货物信息" custom-class="order-cell">
        <template>
          <view class="cell-color-info">
            {{ detailInfo.cargo_name }}, {{ detailInfo.cargo_quantity }} {{ unit }}, {{ detailInfo.cargo_weight }}kg
          </view>
        </template>
      </wd-cell>
      <wd-cell title="货物体积" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.cargo_length }}m, {{ detailInfo.cargo_width }}m, {{ detailInfo.cargo_height }}m</view>
        </template>
      </wd-cell>
      <wd-cell title="货物类型" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.goodType }}, {{ detailInfo.packageType }}</view>
        </template>
      </wd-cell>
      <wd-cell title="装货时间" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.loadingAppointmentTime }}</view>
        </template>
      </wd-cell>
      <wd-cell title="到货时间" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.expectedArrivalTime }}</view>
        </template>
      </wd-cell>
      <wd-cell title="车辆信息" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.vehicleModel }}, {{ detailInfo.vehicleLength }}</view>
        </template>
      </wd-cell>
      <wd-cell title="费用信息" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.cash_on_delivery }}, {{ detailInfo.paymentMethod }}</view>
        </template>
      </wd-cell>
      <wd-cell title="手续费" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ (detailInfo.cash_on_delivery * 0.01).toFixed(1) }}</view>
        </template>
      </wd-cell>
      <wd-cell title="备注" custom-class="order-cell">
        <template>
          <view class="cell-color-info">{{ detailInfo.remark }}</view>
        </template>
      </wd-cell>
    </wd-card>
  </view>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { transCodeToName } from "@/utils/utils";
import { PACKAGE_TYPE } from "@/utils/dict";
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----变量等------------------------------------------------------------------
const props = defineProps({
  detailInfo: {
    type: Object,
    default: () => {},
  },
});
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
const unit = computed(() => {
  if (!props.detailInfo.packaging_method) return "";
  return transCodeToName(PACKAGE_TYPE, props.detailInfo.packaging_method, "value", "unit");
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------

// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.order-cell {
  .wd-cell__title {
    color: #a7a7a7;
  }

  .wd-cell__right {
    flex: 2 !important;
  }
}
</style>
