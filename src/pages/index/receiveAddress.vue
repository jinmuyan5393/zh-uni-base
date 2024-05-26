<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "收货地址",
  },
}
</route>

<template>
  <view class="receive-address">
    <wd-form ref="formRef" :model="form" :rules="rules">
      <wd-card title="基础信息" custom-class="custom-card-required">
        <wd-col-picker
          label="选择地址"
          label-width="80px"
          v-model="selectCity"
          :columns="area"
          :column-change="columnChange"
          :display-format="displayFormat"
          @confirm="handlePickerChange"></wd-col-picker>
        <view class="flex items-center justify-between px-[15px]">
          <view class="flex-1 pr-2">
            <wd-input prop="destination_address" required clearable v-model="form.destination_address" @focus="handleFocus" placeholder="详细地址" />
          </view>
          <view class="flex flex-col" @click="jumpMap">
            <wd-icon name="location" size="20px" color="#ff0000"></wd-icon>
            <text class="location-txt">定位</text>
          </view>
        </view>
      </wd-card>
      <wd-card title="收货信息">
        <wd-input
          label="收货人姓名"
          custom-class="card-input"
          label-width="90px"
          prop="consignee_name"
          required
          clearable
          v-model="form.consignee_name"
          placeholder="请输入" />
        <wd-input
          label="联系方式"
          custom-class="card-input"
          label-width="90px"
          type="number"
          prop="consignee_contact_number"
          required
          clearable
          v-model="form.consignee_contact_number"
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
import { ref, onMounted, nextTick } from "vue";
import { areaData } from "@/utils/area";
import { phoneValidate } from "@/utils/validate";
const props = defineProps({
  formData: {
    type: String,
  },
});
const formRef = ref();
const form = ref({
  destination_province_code: "",
  destination_city_code: "",
  destination_district_code: "",
  destination_address_coordinates: "",
  destination_address: "",
  consignee_name: "",
  consignee_contact_number: "",
});
const selectCity = ref([]);
const selectCityLables = ref("");

const rules = ref<any>({
  destination_address: [
    {
      required: true,
      message: "请输入详细地址",
      trigger: "blur",
    },
  ],
  consignee_name: [
    {
      required: true,
      message: "请输入收货人姓名",
      trigger: "blur",
    },
  ],
  consignee_contact_number: [
    {
      required: true,
      message: "请输入收货人联系方式",
      trigger: "blur",
    },
    {
      validator: phoneValidate,
      message: "请输入正确的手机号",
    },
  ],
});

const area = ref<any[]>([
  Object.keys(areaData[86]).map(key => {
    return {
      value: key,
      label: areaData[86][key],
    };
  }),
]);
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
onMounted(() => {
  initData();
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
// 初始化
function initData() {
  const data = props.formData ? JSON.parse(props.formData) : {};
  nextTick(() => {
    form.value = {
      ...form.value,
      ...data,
    };
    if (data.destination_province_code) {
      selectCity.value = [data.destination_province_code, data.destination_city_code];
      selectCityLables.value = data.receiveLabel;
      area.value = [
        Object.keys(areaData[86]).map(key => {
          return {
            value: key,
            label: areaData[86][key],
          };
        }),
        Object.keys(areaData[data.destination_province_code]).map(key => {
          return {
            value: key,
            label: areaData[data.destination_province_code][key],
          };
        }),
      ];
    }
  });
}
// 回填地图选中的地址
function setAddress(add: any) {
  const {
    title,
    adcode,
    city,
    district,
    province,
    location: { lat, lng },
  } = add;
  form.value.destination_address = title;
  form.value.destination_address_coordinates = `${lat}, ${lng}`;
  selectCityLables.value = `${province}-${city}-${district}`;
  // 根据区编码获取省市编码
  let cityCode = String(adcode).slice(0, 4) + "00";
  let provCode = String(adcode).slice(0, 2) + "0000";
  // 香港澳门特殊处理
  if (provCode.startsWith("81") || provCode.startsWith("82")) {
    provCode = provCode.startsWith("81") ? "810000" : "820000";
    cityCode = provCode.startsWith("81") ? "810100" : "820100";
  }
  selectCity.value = [provCode, cityCode];
  area.value = [
    Object.keys(areaData[86]).map(key => {
      return {
        value: key,
        label: areaData[86][key],
      };
    }),
    Object.keys(areaData[provCode]).map(key => {
      return {
        value: key,
        label: areaData[provCode][key],
      };
    }),
  ];
}
/**
 * 当输入框为空时，不可编辑地址，直接跳转地图选址
 */
function handleFocus() {
  if (!form.value.destination_address) {
    jumpMap();
  }
}
// 地图选址
function jumpMap() {
  const regionList = selectCityLables.value.split("-");
  const lastRegion = regionList.pop();
  const region = lastRegion || "";
  uni.navigateTo({
    url: "/pages/map/map?region=" + region,
  });
}

// 保存
function handleSubmit() {
  formRef.value.validate().then(({ valid }) => {
    if (valid) {
      let [provCode, cityCode] = selectCity.value;
      // 香港澳门特殊处理 省市保持一致
      if (provCode.startsWith("81") || provCode.startsWith("82")) {
        cityCode = provCode;
      }
      form.value.destination_province_code = provCode;
      form.value.destination_city_code = cityCode;

      const info = {
        ...form.value,
        receiveLabel: selectCityLables.value,
      };
      const pages = getCurrentPages();
      const prePage = pages[pages.length - 2];
      prePage.$vm.setFormInfo && prePage.$vm.setFormInfo(info);
      uni.navigateBack();
    }
  });
}

// 省市联动
function columnChange({ selectedItem, index, resolve, finish }) {
  // index < 1 只展示两级
  if (areaData[selectedItem.value] && index < 1) {
    resolve(
      Object.keys(areaData[selectedItem.value]).map(key => {
        return {
          value: key,
          label: areaData[selectedItem.value][key],
        };
      }),
    );
  } else {
    finish();
  }
}

// 切换省市picker
function handlePickerChange(e) {
  selectCityLables.value = e.selectedItems.map(item => item.label).join("-");
  // 选完省市之后，清空详情地址 (防止省市和详细地址不一致)
  form.value.destination_address = "";
}

function displayFormat(selectedItems) {
  return selectedItems.map(item => item.label).join("-");
}

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------
defineExpose({
  setAddress,
});
// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.receive-address {
  box-sizing: border-box;
  height: 100%;
  padding-top: 20rpx;

  .location-txt {
    font-size: 10px;
    color: #f00;
  }
}
</style>
