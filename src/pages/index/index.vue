<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
    navigationBarTitleText: "首页",
  },
}
</route>
<template>
  <view class="home">
    <view class="header relative">
      <image class="header-bg" src="/static/images/header-bg.png" />
      <!--收发货地址-->
      <view class="address-box absolute p-2">
        <view class="bg-white rounded-lg px-3 py-4">
          <view class="send-box flex items-center" @click="jumpAddress('send')">
            <view class="send-icon flex justify-center items-center rounded text-white">装</view>
            <view class="send-address ml-2 rounded flex-1 bg-[#f5f5f5] py-2 pl-[15px] h-[60px] flex items-center">
              <view class="holder" v-if="!form.departure_address">在哪儿装货</view>
              <view class="send-info flex flex-col h-full justify-around" v-else>
                <view class="label">{{ form.sendLabel }}</view>
                <view class="add">{{ form.departure_address }}</view>
              </view>
            </view>
          </view>
          <view class="split absolute">
            <image class="arrow" src="/static/images/double-arrow.png" />
          </view>
          <view class="receive-box mt-3 flex items-center" @click="jumpAddress('receive')">
            <view class="receive-icon flex justify-center items-center rounded text-white">卸</view>
            <view class="receive-address ml-2 rounded flex-1 bg-[#f5f5f5] py-2 pl-[15px] h-[60px] flex items-center">
              <view class="holder" v-if="!form.destination_address">货送到哪儿</view>
              <view class="receive-info flex flex-col h-full justify-around" v-else>
                <view class="label">{{ form.receiveLabel }}</view>
                <view class="add">{{ form.destination_address }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="wrapper px-2 mt-2">
      <!--发货单内容-->
      <view class="order-box mt-2">
        <wd-cell title="货物信息" custom-class="custom-cell" is-link @click="jumpPage('/pages/index/productInfo')">
          <template>
            <view class="text-blue-400 font-bold">{{ proInfo }}</view>
          </template>
        </wd-cell>
        <wd-cell title="发货信息" custom-class="custom-cell">
          <template>
            <view class="text-blue-400 font-bold">{{ sendInfo }}</view>
          </template>
        </wd-cell>
        <wd-cell title="收货信息" custom-class="custom-cell">
          <template>
            <view class="text-blue-400 font-bold">{{ receiveInfo }}</view>
          </template>
        </wd-cell>
        <wd-cell title="车辆信息" custom-class="custom-cell" is-link @click="jumpPage('/pages/index/carInfo')">
          <template>
            <view class="text-blue-400 font-bold">{{ carInfo }}</view>
          </template>
        </wd-cell>
        <wd-cell title="其他信息" custom-class="custom-cell" is-link @click="jumpPage('/pages/index/otherInfo')">
          <template>
            <view class="text-blue-400 font-bold">{{ otherInfo }}</view>
          </template>
        </wd-cell>
      </view>
    </view>
    <view class="page-footer">
      <wd-button block @click="handleSubmit">发布需求</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { GOODS_TYPE, PACKAGE_TYPE, CAR_TYPE, CAR_LENGTH, PAYMENT_TYPE } from "@/utils/dict";
import { orderAddAPI } from "@/service/index";
import { Toast, transCodeToName } from "@/utils/utils";
import { useUserStore } from "@/store";
onLoad(() => {});
const form = ref<any>({});

const userStore = useUserStore();

// 跳转页面
function jumpPage(url) {
  // 登录校验
  if (!checkLogin()) {
    return;
  }
  uni.navigateTo({
    url: `${url}?formData=${JSON.stringify(form.value)}`,
  });
}

// 发布需求
function handleSubmit() {
  if (checkData()) {
    const params = {
      ...form.value,
    };
    params.expected_arrival_time = String(params.expected_arrival_time).slice(0, -3);
    params.loading_appointment_time = String(params.loading_appointment_time).slice(0, -3);
    orderAddAPI(params).then(res => {
      if (res && res.code === 1) {
        Toast(res.msg, () => {
          // 提交成功 清空数据
          form.value = {};
          uni.switchTab({
            url: "/pages/orderList/orderList",
          });
        });
      } else {
        Toast(res.msg);
      }
    });
  }
}

// 货物信息
const proInfo = computed(() => {
  if (!form.value.cargo_name) return "";
  const goodsType = transCodeToName(GOODS_TYPE, form.value.cargo_type);
  const packageType = transCodeToName(PACKAGE_TYPE, form.value.packaging_method);
  const packageUnit = transCodeToName(PACKAGE_TYPE, form.value.packaging_method, "value", "unit");
  return `${form.value.cargo_name},${form.value.cargo_quantity}${packageUnit},${goodsType},${packageType}`;
});

// 发货信息
const sendInfo = computed(() => {
  if (!form.value.consignor_name) return "";
  return `${form.value.consignor_name} - ${form.value.consignor_contact_number}`;
});

// 收货信息
const receiveInfo = computed(() => {
  if (!form.value.consignee_name) return "";
  return `${form.value.consignee_name} - ${form.value.consignee_contact_number}`;
});

// 车辆信息
const carInfo = computed(() => {
  if (!form.value.vehicle_model) return "";
  const vehicleModel = transCodeToName(CAR_TYPE, form.value.vehicle_model);
  const vehicleLength = transCodeToName(CAR_LENGTH, form.value.vehicle_length);
  return `${vehicleModel},${vehicleLength}`;
});

// 其他信息
const otherInfo = computed(() => {
  if (!form.value.cash_on_delivery) return "";
  const paymentMethod = transCodeToName(PAYMENT_TYPE, form.value.packaging_method);
  return `${form.value.cash_on_delivery}元,${paymentMethod}`;
});

function jumpAddress(flag) {
  // 登录校验
  if (!checkLogin()) {
    return;
  }
  if (flag === "send") {
    uni.navigateTo({
      url: "/pages/index/sendAddress?formData=" + JSON.stringify(form.value),
    });
  } else if (flag === "receive") {
    uni.navigateTo({
      url: "/pages/index/receiveAddress?formData=" + JSON.stringify(form.value),
    });
  }
}

// 回填信息
function setFormInfo(info) {
  form.value = {
    ...form.value,
    ...info,
  };
}

// 校验必填项
function checkData() {
  // 发货信息
  if (!form.value.consignor_name) {
    uni.showToast({
      title: "请填写发货人信息",
      icon: "none",
    });
    return false;
  }
  // 收货信息
  if (!form.value.consignee_name) {
    uni.showToast({
      title: "请填写收货人信息",
      icon: "none",
    });
    return false;
  }

  // 货物信息
  if (!form.value.cargo_name) {
    uni.showToast({
      title: "请填写货物信息",
      icon: "none",
    });
    return false;
  }

  // 车辆信息
  if (!form.value.vehicle_model) {
    uni.showToast({
      title: "请填写车辆信息",
      icon: "none",
    });
    return false;
  }

  // 其他信息
  if (!form.value.cash_on_delivery) {
    uni.showToast({
      title: "请填写其他信息",
      icon: "none",
    });
    return false;
  }
  return true;
}

// 登录拦截
function checkLogin() {
  const { token } = userStore.userInfo as unknown as IUserInfo;
  if (!token) {
    uni.navigateTo({
      url: "/pages/login/login",
    });
    return false;
  }
  return true;
}

defineExpose({
  setFormInfo,
});
</script>

<style lang="scss" scoped>
.home {
  padding-bottom: 130rpx;

  .header {
    .header-bg {
      width: 100%;
      height: 810rpx;
    }

    .address-box {
      top: 385rpx;
      box-sizing: border-box;
      width: 100%;

      .send-icon {
        width: 24px;
        height: 24px;
        font-size: 14px;
        background: #2698f7;
      }

      .receive-icon {
        width: 24px;
        height: 24px;
        font-size: 14px;
        background: #ff5b00;
      }

      .split {
        top: 50%;
        margin-top: -12px;

        .arrow {
          width: 18px;
          height: 18px;
        }
      }

      .holder {
        font-size: 18px;
        font-weight: bold;
        color: #999;
      }
    }
  }

  .send-info,
  .receive-info {
    .label {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .wrapper {
    box-sizing: border-box;
    width: 100%;

    .order-box {
      :deep(.wd-cell) {
        &:first-child {
          border-radius: 16rpx 16rpx 0 0;
        }

        &:last-child {
          border-radius: 0 0 16rpx 16rpx;
        }
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 20rpx;
    box-sizing: border-box;
    width: 100%;
  }
}
</style>
