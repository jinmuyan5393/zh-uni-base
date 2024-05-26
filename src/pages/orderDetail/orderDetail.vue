<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "订单详情",
    navigationBarBackgroundColor: "#2e60ff",
    navigationBarTextStyle: "white",
  },
}
</route>

<template>
  <view class="order-detail">
    <view class="header pt-2">
      <wd-card custom-class="header-card">
        <template #title>
          <view class="flex justify-between items-center">
            <view class="title">运输路线</view>
            <view class="logistics text-blue-500 cursor-pointer text-xs" v-if="[3, 4, 5].includes(detailInfo.status)" @click="jumpLogistics">
              物流信息
            </view>
          </view>
        </template>
        <view class="send pb-3 flex">
          <view class="icon bg-blue-500 font-bold rounded text-white">发</view>
          <view class="send-info ml-2 flex-1">
            <view class="prov font-bold text-black">{{ detailInfo.departure_province_name }}-{{ detailInfo.departure_city_name }}</view>
            <view class="send-user flex mt-1">
              <view class="username">{{ detailInfo.consignor_name }}</view>
              <view class="tel text-blue-500 ml-2">{{ detailInfo.consignor_contact_number }}</view>
            </view>
            <view class="address text-gray-500 mt-1">{{ detailInfo.departure_address }}</view>
          </view>
        </view>
        <view class="receive flex">
          <view class="icon bg-orange-500 font-bold rounded text-white">收</view>
          <view class="receive-info ml-2 flex-1">
            <view class="prov font-bold text-black">{{ detailInfo.destination_province_name }}-{{ detailInfo.destination_city_name }}</view>
            <view class="receive-user flex mt-1">
              <view class="username">{{ detailInfo.consignee_name }}</view>
              <view class="tel text-blue-500 ml-2">{{ detailInfo.consignee_contact_number }}</view>
            </view>
            <view class="address text-gray-500 mt-1">{{ detailInfo.destination_address }}</view>
          </view>
        </view>
      </wd-card>
    </view>
    <view class="flex justify-around">
      <view class="tab-btn" :class="{ active: curBtn === 1 }" @click="changeBtn(1)">货物信息</view>
      <view class="tab-btn" :class="{ active: curBtn === 2 }" @click="changeBtn(2)">托运单信息</view>
      <view class="tab-btn" :class="{ active: curBtn === 3 }" @click="changeBtn(3)">调度信息</view>
    </view>
    <scroll-view scroll-y class="content">
      <!-- 货物信息-->
      <productInfo v-if="curBtn === 1" :detail-info="detailInfo" />
      <!--托运单信息-->
      <Waybill v-if="curBtn === 2" :detail-info="detailInfo" />
      <!-- 调度信息 -->
      <schedInfo v-if="curBtn === 3" :detail-info="detailInfo" />
    </scroll-view>
    <view class="page-footer">
      <!--托运单已取消-->
      <view v-if="detailInfo.is_valid === 0">
        <wd-button block type="info" disabled>托运单已取消</wd-button>
      </view>
      <!-- 待承接 -->
      <view v-else-if="detailInfo.status === 1">
        <wd-button v-if="!hasReminderOrder" block type="primary" @click="handleRemind">催单</wd-button>
        <wd-button v-else block type="info" disabled>已催单</wd-button>
      </view>
      <!-- 已承接 -->
      <view v-else-if="detailInfo.status === 2">
        <view class="flex justify-around" v-if="action === 3">
          <wd-button @click="agree(detailInfo.waybill.id)">同意</wd-button>
          <wd-button type="error" @click="refuse(detailInfo.waybill.id)">拒绝</wd-button>
        </view>
        <wd-button v-else-if="action === 5" block type="info" disabled>货物待运输</wd-button>
        <wd-button v-else block type="info" disabled>托运单审核中</wd-button>
      </view>
      <!-- 运输中 -->
      <view v-else-if="detailInfo.status === 3">
        <wd-button block type="info" disabled>货物运输中</wd-button>
      </view>
      <!-- 已送达 -->
      <view v-else-if="detailInfo.status === 4" class="flex justify-around">
        <wd-button @click="confirmOrder">确认签收</wd-button>
        <wd-button type="error" @click="damageReport">损坏上报</wd-button>
      </view>
      <!-- 已签收 -->
      <view v-else-if="detailInfo.status === 5">
        <wd-button block type="info" disabled>货物已签收</wd-button>
      </view>
      <!-- 已损坏 -->
      <view v-else-if="detailInfo.status === 6">
        <wd-button block type="info" disabled>货物已损坏</wd-button>
      </view>
      <view v-else>
        <wd-button block type="info" disabled>订单待处理</wd-button>
      </view>
    </view>
    <wd-message-box />
  </view>
</template>

<script lang="ts" setup>
/// ///////////////////////////////////////////////////////////////////////////////
import { ref, onMounted, computed } from "vue";
import productInfo from "@/components/orderDetail/productInfo.vue";
import Waybill from "@/components/orderDetail/waybill.vue";
import schedInfo from "@/components/orderDetail/schedInfo.vue";
import { orderDetailAPI, orderAgreeAPI, orderRefuseAPI, orderSignedAPI, reportDamageAPI } from "@/service/index";
import { Toast, transCodeToName } from "@/utils/utils";
import { ORDER_STATUS, CAR_TYPE, CAR_LENGTH, GOODS_TYPE, PACKAGE_TYPE, PAYMENT_TYPE } from "@/utils/dict";
import { getCodeMap } from "@/utils/area";
import dayjs from "dayjs";
import { useMessage } from "wot-design-uni";
const message = useMessage();
// #region ----变量等------------------------------------------------------------------
const props = defineProps({
  id: {
    type: Number,
  },
  type: {
    type: String,
    default: "",
  },
});
const codeMap = getCodeMap();
const detailInfo = ref<any>({});
const curBtn = ref(1);
const hasReminderOrder = ref(false);
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
onMounted(() => {
  queryDetail();
  curBtn.value = props.type ? 2 : 1;
});
const action = computed(() => {
  if (detailInfo.value.waybill) {
    return detailInfo.value.waybill.auditLogs[detailInfo.value.waybill.auditLogs.length - 1].action;
  }
  return 0;
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
function queryDetail() {
  orderDetailAPI({
    order_id: props.id,
  }).then(res => {
    if (res && res.code === 1) {
      const detail: any = res.data || {};
      detailInfo.value = {
        ...detail,
        statusLabel: transCodeToName(ORDER_STATUS, detail.status),
        vehicleModel: transCodeToName(CAR_TYPE, detail.vehicle_model),
        vehicleLength: transCodeToName(CAR_LENGTH, detail.vehicle_length),
        goodType: transCodeToName(GOODS_TYPE, detail.cargo_type),
        packageType: transCodeToName(PACKAGE_TYPE, detail.packaging_method),
        loadingAppointmentTime: dayjs(detail.loading_appointment_time * 1000).format("YYYY-MM-DD HH:mm"),
        expectedArrivalTime: dayjs(detail.expected_arrival_time * 1000).format("YYYY-MM-DD HH:mm"),
        paymentMethod: transCodeToName(PAYMENT_TYPE, detail.payment_method),
        departure_province_name: codeMap[detail.departure_province_code],
        departure_city_name: codeMap[detail.departure_city_code],
        departure_district_name: codeMap[detail.departure_district_code],
        destination_province_name: codeMap[detail.destination_province_code],
        destination_city_name: codeMap[detail.destination_city_code],
        destination_district_name: codeMap[detail.destination_district_code],
      };
    } else {
      Toast(res.msg);
    }
  });
}

// 切换tab
function changeBtn(index: number) {
  curBtn.value = index;
}

/** 催单 */
function handleRemind() {
  hasReminderOrder.value = true;
  message.show("催单成功");
}

/** 确认托运单 */
function agree(id: number) {
  message
    .confirm({
      msg: "是否确认通过托运单",
      title: "提示",
    })
    .then(() => {
      orderAgreeAPI({ waybill_id: id }).then((res: any) => {
        if (res && res.code === 1) {
          Toast("确认托运单");
          queryDetail();
        } else {
          Toast(res.msg);
        }
      });
    })
    .catch(() => {});
}

/** 拒绝托运单 */
function refuse(id: number) {
  message
    .confirm({
      msg: "是否确认拒绝托运单",
      title: "提示",
    })
    .then(() => {
      orderRefuseAPI({ waybill_id: id }).then((res: any) => {
        if (res && res.code === 1) {
          Toast("拒绝托运单");
          queryDetail();
        } else {
          Toast(res.msg);
        }
      });
    })
    .catch(() => {});
}

/** 物流信息查看 */
function jumpLogistics() {
  uni.navigateTo({
    url: "/pages/logisticsInfo/logisticsInfo?id=" + props.id,
  });
}

/** 确认签收 */
function confirmOrder() {
  if (detailInfo.value.cargo_damage_report_status === 1) {
    Toast("该订单已上报损坏,暂无法签收");
    return;
  }
  message
    .confirm({
      msg: "是否确认签收托运单",
      title: "提示",
    })
    .then(() => {
      orderSignedAPI({ order_id: props.id }).then((res: any) => {
        if (res && res.code === 1) {
          Toast("签收成功");
          queryDetail();
        } else {
          Toast("签收异常");
        }
      });
    })
    .catch(() => {});
}

// 损坏上报
function damageReport() {
  if (detailInfo.value.cargo_damage_report_status === 1) {
    Toast("该订单已上报损坏");
    return;
  }
  message
    .prompt({
      title: "损坏上报",
      inputValue: "",
      inputPlaceholder: "请输入损坏描述",
      inputError: "描述不能为空",
      inputPattern: /^.*\S.*$/,
    })
    .then(({ value }) => {
      reportDamageAPI({ order_id: props.id, remark: value }).then((res: any) => {
        if (res && res.code === 1) {
          Toast("上报成功");
          queryDetail();
        } else {
          Toast("上报失败");
        }
      });
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
.order-detail {
  padding-bottom: 130rpx;

  .header {
    background-image: linear-gradient(180deg, #2e60ff 0%, #f2f2f2 100%);

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
    }
  }

  .tab-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 200rpx;
    padding: 12rpx;
    color: #111;

    &::after {
      display: block;
      width: 60rpx;
      height: 7rpx;
      margin-top: 10rpx;
      content: "";
      background-color: transparent;
      border-radius: 4rpx;
    }

    &.active {
      color: #4d80f0;

      &::after {
        background-color: #4d80f0;
      }
    }
  }

  .content {
    height: calc(100vh - 680rpx + 27rpx);
  }
}
</style>
