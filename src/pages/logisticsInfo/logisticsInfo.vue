<!--
 * @Description: 物流信息
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-21 14:26:20
-->
<template>
  <div class="logistics">
    <div class="map-box">
      <map class="map" :polyline="polyline" :markers="markers" :longitude="center.longitude" :latitude="center.latitude" :scale="14" />
    </div>
    <div class="schedule">
      <logistics :detail-info="detailInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getOrderLogisticsInfoAPI, orderDetailAPI } from "@/service/index";
import logistics from "@/components/orderDetail/logistics.vue";
import { Toast } from "@/utils/utils";
/// ///////////////////////////////////////////////////////////////////////////////
defineOptions({
  name: "LogisticsInfo",
});
const props = defineProps({
  id: {
    // 订单id
    type: String,
    default: "",
  },
});
// #region ----变量等------------------------------------------------------------------
const center = ref({
  longitude: 116.397428,
  latitude: 39.90923,
});

const detailInfo = ref({});

// 起始和当前点
const markers = ref([]);
// 路线
const polyline = ref([]);
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
onMounted(() => {
  queryDetail();
  // 物流信息
  queryLogisticsInfo();
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
// 详情
function queryDetail() {
  orderDetailAPI({
    order_id: props.id,
  }).then(res => {
    if (res && res.code === 1) {
      const detail: any = res.data || {};
      detailInfo.value = {
        ...detail,
      };
    } else {
      Toast("获取详情异常");
    }
  });
}

/** 获取物流信息 */
function queryLogisticsInfo() {
  getOrderLogisticsInfoAPI({
    order_id: props.id,
    mapType: "GOOGLE",
  }).then((res: any) => {
    polyline.value = [];
    markers.value = [];
    // 获取gps_data
    let scheduleList = res.data || [];
    // 组装数据，拼接铁路段节点
    scheduleList = scheduleList.map((item, index) => {
      let gpsData = [];
      if (item.type === 1) {
        // 公路
        gpsData = item?.gps_data?.result || [];
      } else {
        // 铁路 取上一段的结束点和下一段的起始点
        const prev = scheduleList[index - 1];
        const next = scheduleList[index + 1];
        const prevGpsData = prev?.gps_data?.result || [];
        const nextGpsData = next?.gps_data?.result || [];
        if (prevGpsData.length && nextGpsData.length) {
          gpsData = [prevGpsData[prevGpsData.length - 1], nextGpsData[0]];
        }
      }
      // 转换经纬度
      gpsData = gpsData.map((item, index) => {
        return {
          id: index + 1,
          longitude: item.lng,
          latitude: item.lat,
          direction: item.direction,
        };
      });
      return {
        type: item.type,
        gpsData,
      };
    });
    const allGpsData = [];
    scheduleList.forEach((item: any) => {
      const gps = item.gpsData || [];
      allGpsData.push(...gps);
    });

    // 中心点
    if (allGpsData.length) {
      const start = allGpsData[0];
      const end = allGpsData[allGpsData.length - 1];
      center.value = { ...start };
      const startPoint = {
        id: start.id,
        latitude: start.latitude,
        longitude: start.longitude,
        iconPath: "/static/images/start.png",
        width: 34,
        height: 34,
      };
      const curPoint = {
        id: end.id,
        latitude: end.latitude,
        longitude: end.longitude,
        iconPath: "/static/images/car.png",
        width: 34,
        height: 34,
        rotate: 360 - end.direction,
      };
      console.log("direction: ", end.direction);
      markers.value = [startPoint, curPoint];
    }
    // 路线信息
    const lineList = [];
    scheduleList.forEach(item => {
      lineList.push({
        points: item.gpsData,
        color: item.type === 1 ? "#3085fe" : "#ff0000",
        width: 5,
      });
    });
    polyline.value = lineList;
  });
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------

// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.logistics {
  height: 100vh;
  overflow: hidden;

  .map-box {
    width: 100%;
    height: 500rpx;

    .map {
      width: 100%;
      height: 100%;
    }
  }

  .schedule {
    box-sizing: border-box;
    max-height: calc(100% - 500rpx);
    padding: 10px 0;
    overflow-y: auto;
  }
}
</style>
