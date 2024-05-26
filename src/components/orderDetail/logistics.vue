<template>
  <view class="sched-info">
    <view v-if="dispatchInformation.length">
      <wd-card>
        <template>
          <wd-steps vertical dot>
            {{ dispatchInformation }}
            <wd-step v-for="(item, index) in dispatchInformation" :key="index" status="finished">
              <template #title>
                <view>
                  <!-- [{{ item.typeDesc }}] -->
                  {{ item.title }}
                </view>
              </template>
              <template #description>
                <view v-for="(k, i) in item.description" :key="i">{{ k.title }}：{{ k.value }}</view>
              </template>
            </wd-step>
          </wd-steps>
        </template>
      </wd-card>
    </view>
    <NoData tip="暂无物流信息" style="height: 500rpx" v-else />
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
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
const dispatchInformation = computed(() => {
  // return props.detailInfo.waybill.schedulings;
  // 1.第一段取两个，后面都取最后一个
  if (props.detailInfo?.waybill?.scheduling) {
    const dispatchData = props.detailInfo.waybill.scheduling;
    let data: any = [];
    dispatchData.forEach((ele: any, index: number) => {
      // 合并数组
      data = data.concat(getDispatchInfo(ele));
    });
    console.log("data: ", data);
    // 过滤未开始的路线
    data = data.filter(item => item.status);
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
          description: [{ title: "到达时间", value: formatTime(element.completed_time) }],
          typeDesc: "途",
          status: element.is_completed ? "finished" : "",
        });
      } else if (i === data.waypoint.length - 1) {
        if (i === 0) {
          arr.push(getRouteInfo(1, 1, element.origin, data));
        }
        arr.push(getRouteInfo(1, 2, element.destination, data));
      } else {
        arr.push({
          title: element.destination,
          description: [{ title: "到达时间", value: formatTime(element.completed_time) }],
          typeDesc: "途",
          status: element.is_completed ? "finished" : "",
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
  const status = getstartAndEndStatus(startAndEnd, data);
  if (type === 1) {
    return {
      title,
      description: [
        // { title: "司机信息", value: `${data.driver_user.name} ${data.driver_user.profile.phone}` },
        {
          title: startAndEnd === 1 ? "开始时间" : "到达时间",
          value: formatTime(startAndEnd === 1 ? data.start_time : data.end_time),
        },
      ],
      status: status ? "finished" : "",
      typeDesc: "公",
    };
  } else if (type === 2) {
    return {
      title,
      description: [
        { title: "车次信息", value: data.train_number },
        {
          title: startAndEnd === 1 ? "发车时间" : "到达时间",
          value: formatTime(startAndEnd === 1 ? data.pickup_time : data.delivery_time),
        },
      ],
      status: status ? "finished" : "",
      typeDesc: "铁",
    };
  }
}

/**
 * 起点终点状态
 * @param index 1:起点 2:终点
 * @param data
 */
function getstartAndEndStatus(index, data) {
  const status = index === 1 ? data.is_start : data.is_end;
  return status;
}
// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped></style>
