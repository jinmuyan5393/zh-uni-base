<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "地图选址",
  },
}
</route>

<template>
  <view class="map-wrapper flex flex-col">
    <view class="header bg-white p-3">
      <view class="flex justify-between">
        <view @click="cancle">取消</view>
        <view @click="confirmAddress">确定</view>
      </view>
      <view class="search-box">
        <wd-search v-model="searchVal" @search="search" hide-cancel />
      </view>
    </view>
    <view class="map-box">
      <map class="map" :markers="markers" :longitude="center.longitude" :latitude="center.latitude" :scale="10" />
    </view>
    <view class="search-result flex-1">
      <scroll-view class="result-list" scroll-y enable-flex>
        <view class="address-item flex justify-between" v-for="item in resultList" :key="item.id" @click="chooseAddress(item)">
          <view>
            <view class="title">{{ item.title }}</view>
            <view class="address">{{ item.address }}</view>
          </view>
          <view class="flex items-center px-2">
            <image v-if="curSelect.id === item.id" class="selected-icon" src="/static/images/selected.png" />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
//
import { ref } from "vue";
import { Toast } from "@/utils/utils";
const props = defineProps({
  region: String,
});
const MAP_KEY = import.meta.env.VITE_TENGXUN_MAP_KEY;
const searchVal = ref("");
const resultList = ref([]);
const center = ref({
  longitude: "116.397128",
  latitude: "39.916527",
});
const markers = ref([]);
const curSelect = ref<any>({});

function search() {
  uni.request({
    url: `https://apis.map.qq.com/ws/place/v1/suggestion`,
    method: "GET",
    data: {
      keyword: searchVal.value,
      key: MAP_KEY,
      region: props.region,
      page_size: 10,
      page_index: 1,
    },
    success: (res: any) => {
      resultList.value = res.data.data || [];
      curSelect.value = {};
      if (resultList.value.length === 0) {
        Toast("未搜索到结果");
      }
    },
  });
}

// 选择地址
function chooseAddress(item: any) {
  markers.value = [{ id: 1, latitude: item.location.lat, longitude: item.location.lng, width: "30px", height: "30px" }];
  center.value = {
    longitude: item.location.lng,
    latitude: item.location.lat,
  };
  curSelect.value = item;
}

// 确认选择
function confirmAddress() {
  if (!curSelect.value.id) {
    uni.showToast({
      title: "请选择地址",
      icon: "none",
    });
  } else {
    const pages = getCurrentPages();
    const prePage = pages[pages.length - 2];
    prePage.$vm.setAddress && prePage.$vm.setAddress(curSelect.value);
    uni.navigateBack();
  }
}

// 取消选择
function cancle() {
  uni.navigateBack();
}
</script>

<style lang="scss" scoped>
//
.map-wrapper {
  height: 100vh;

  .map-box {
    width: 100%;
    height: 520rpx;

    .map {
      width: 100%;
      height: 100%;
    }
  }

  .search-result {
    height: 0;
    border: 1px solid #ddd;

    .result-list {
      box-sizing: border-box;
      height: 100%;
      padding-left: 10px;

      .address-item {
        padding: 10px 10px 15px 0;
        border-bottom: 1px solid #ddd;

        .address {
          padding-top: 8px;
          font-size: 13px;
          color: #808080;
        }

        .selected-icon {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
}
</style>
