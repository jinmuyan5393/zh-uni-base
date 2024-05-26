<template>
  <view class="sched-info">
    <view v-if="detailInfo.waybill && [3, 5].includes(curAction)">
      <wd-card>
        <template>
          <wd-steps vertical dot>
            {{ dispatchInformation }}
            <wd-step v-for="(item, index) in dispatchInformation" :key="index" status="finished">
              <template #title>
                <view>[{{ item.typeDesc }}]{{ item.title }}</view>
              </template>
              <template #description>
                <view v-for="(k, i) in item.description" :key="i">{{ k.title }}：{{ k.value }}</view>
              </template>
            </wd-step>
          </wd-steps>
        </template>
      </wd-card>
    </view>
    <NoData tip="暂无调度信息" v-else />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import NoData from "@/components/NoData/NoData.vue";
import { formatTime } from "@/utils/utils";
/// ///////////////////////////////////////////////////////////////////////////////
const props = defineProps({
  detailInfo: {
    type: Object,
    default: () => {},
  },
});
// #region ----变量等------------------------------------------------------------------
const data = ref<any>([
  {
    title: "南京市秦淮区南京夫子庙",
    description: [
      { title: "司机信息", value: "司机测试修改+ 13219940826" },
      { title: "取货时间", value: "2024-05-10 09:00" },
    ],
    typeDesc: "公",
  },
  { title: "镇江市润州区镇江金山风景区", typeDesc: "途" },
  { title: "扬州市邗江区瓜洲古渡", typeDesc: "途" },
  {
    title: "扬州市邗江区扬州火车站",
    description: [
      { title: "司机信息", value: "司机测试修改+ 13219940826" },
      { title: "到达时间", value: "2024-05-11 09:00" },
    ],
    typeDesc: "公",
  },
  {
    title: "扬州站",
    description: [
      { title: "车次信息", value: "G6685" },
      { title: "发车时间", value: "2024-05-11 09:00" },
    ],
    typeDesc: "铁",
  },
  {
    title: "北京站",
    description: [
      { title: "车次信息", value: "G6685" },
      { title: "到达时间", value: "2024-05-11 09:00" },
    ],
    typeDesc: "铁",
  },
  {
    title: "北京市东城区北京站",
    description: [
      { title: "司机信息", value: "2号司机 17366666666" },
      { title: "取货时间", value: "2024-05-12 09:00" },
    ],
    typeDesc: "公",
  },
  {
    title: "北京市东城区王府井小吃街-道路",
    description: [
      { title: "司机信息", value: "2号司机 17366666666" },
      { title: "到达时间", value: "2024-05-13 09:00" },
    ],
    typeDesc: "公",
  },
]);

const curAction = computed(() => {
  if (!props.detailInfo.waybill) {
    return "";
  }
  const auditLogs = props.detailInfo.waybill.auditLogs || [];
  return auditLogs[auditLogs.length - 1].action || "";
});

// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
const dispatchInformation = computed(() => {
  // return props.detailInfo.waybill.schedulings;
  // 1.第一段取两个，后面都取最后一个
  if (props.detailInfo.waybill.scheduling) {
    const dispatchData = props.detailInfo.waybill.scheduling;
    let data: any = [];
    dispatchData.forEach((ele: any, index: number) => {
      // 合并数组
      data = data.concat(getDispatchInfo(ele));
    });
    return data;
  }
  return [];
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------

// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------
/** 获取单段调度信息 */
function getDispatchInfo(data: any) {
  const arr: any = [];
  if (data.type === 1) {
    for (let i = 0; i < data.waypoint.length; i++) {
      const element = data.waypoint[i];
      if (data.waypoint.length > 1 && i === 0) {
        arr.push(getRouteInfo(1, 1, element.origin, data));
        arr.push({
          title: element.destination,
          typeDesc: "途",
        });
      } else if (i === data.waypoint.length - 1) {
        if (i === 0) {
          arr.push(getRouteInfo(1, 1, element.origin, data));
        }
        arr.push(getRouteInfo(1, 2, element.destination, data));
      } else {
        arr.push({
          title: element.destination,
          typeDesc: "途",
        });
      }
    }
  } else {
    // 铁路
    arr.push(getRouteInfo(2, 1, data.waypoint[0].origin, data));
    arr.push(getRouteInfo(2, 2, data.waypoint[0].destination, data));
  }
  return arr;
}

/** 路线信息
 * @param type 1:公路 2:铁路
 * @param startAndEnd 1:起点 2:终点
 * @param title 标题
 * @param data 数据
 */
function getRouteInfo(type: number, startAndEnd: number, title: string, data: any) {
  if (type === 1) {
    return {
      title,
      description: [
        { title: "司机信息", value: `${data.driver_user.name} ${data.driver_user.profile.phone}` },
        {
          title: startAndEnd === 1 ? "取货时间" : "到达时间",
          value: formatTime(startAndEnd === 1 ? data.pickup_time : data.delivery_time, "YYYY-MM-DD HH:mm"),
        },
      ],
      typeDesc: "公",
    };
  } else if (type === 2) {
    return {
      title,
      description: [
        { title: "车次信息", value: data.train_number },
        {
          title: startAndEnd === 1 ? "发车时间" : "到达时间",
          value: formatTime(startAndEnd === 1 ? data.pickup_time : data.delivery_time, "YYYY-MM-DD HH:mm"),
        },
      ],
      typeDesc: "铁",
    };
  }
}
// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped></style>
