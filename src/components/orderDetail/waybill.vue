<template>
  <view class="waybill">
    <view v-if="detailInfo.waybill && [3, 5].includes(curAction)">
      <wd-card>
        <template #title>
          <view class="flex justify-between">
            <view class="title">运费信息</view>
            <view v-if="ticketImg" class="preview text-blue-400" @click="previewImg">预览单据</view>
          </view>
        </template>
        <wd-cell title="运费">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.freight_charge }}</view>
          </template>
        </wd-cell>
        <wd-cell title="现返">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.cash_return }}</view>
          </template>
        </wd-cell>
        <wd-cell title="欠返">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.credit_return }}</view>
          </template>
        </wd-cell>
        <wd-cell title="送货费">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.delivery_fee }}</view>
          </template>
        </wd-cell>
        <wd-cell title="提货费">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.pick_up_fee }}</view>
          </template>
        </wd-cell>
        <wd-cell title="装卸费">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.loading_unloading_fee }}</view>
          </template>
        </wd-cell>
        <wd-cell title="声明价值">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.declared_value }}</view>
          </template>
        </wd-cell>
        <wd-cell title="保价费">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.insurance_fee }}</view>
          </template>
        </wd-cell>
        <wd-cell title="包装费">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.packaging_fee }}</view>
          </template>
        </wd-cell>
        <wd-cell title="其他费用">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.other_charges }}</view>
          </template>
        </wd-cell>
      </wd-card>
      <wd-card title="其他信息">
        <wd-cell title="结算状态">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.is_settlement === 0 ? "未结算" : "已结算" }}</view>
          </template>
        </wd-cell>
        <wd-cell title="是否回收">
          <template>
            <view class="cell-color-info">{{ detailInfo.waybill.is_recycling === 0 ? "待回收" : "已回收" }}</view>
          </template>
        </wd-cell>
        <wd-cell title="托运单审核状态">
          <template>
            <view class="cell-color-info">
              {{ transCodeToName(CONSIGNMENT_STATUS, detailInfo.waybill.auditLogs[detailInfo.waybill.auditLogs.length - 1].action) }}
            </view>
          </template>
        </wd-cell>
      </wd-card>
    </view>
    <NoData tip="暂无托运单信息" v-else />
  </view>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import NoData from "@/components/NoData/NoData.vue";
import { CONSIGNMENT_STATUS } from "@/utils/dict";
import { transCodeToName, getFileUrl } from "@/utils/utils";
/// ///////////////////////////////////////////////////////////////////////////////
const props = defineProps({
  detailInfo: {
    type: Object,
    default: () => {},
  },
});
// #region ----变量等------------------------------------------------------------------
const curAction = computed(() => {
  if (!props.detailInfo.waybill) {
    return "";
  }
  const auditLogs = props.detailInfo.waybill.auditLogs || [];
  return auditLogs[auditLogs.length - 1].action || "";
});

// 单据
const ticketImg = computed(() => {
  if (!props.detailInfo.waybill) return "";
  const img = props.detailInfo.waybill.img || "";
  const imgSrc = getFileUrl(img);
  return imgSrc;
});
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
/** 预览 */
function previewImg() {
  uni.previewImage({
    urls: [ticketImg.value],
  });
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------

// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped></style>
