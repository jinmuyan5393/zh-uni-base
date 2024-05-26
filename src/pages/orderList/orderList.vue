<route lang="json5" type="page">
{
  layout: "default",
  style: {
    navigationBarTitleText: "列表",
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="order-list">
    <wd-tabs v-model="curTab" @change="handleChange">
      <template v-for="item in tabs" :key="item.id">
        <wd-tab :title="item.name"></wd-tab>
      </template>
    </wd-tabs>
    <scroll-view scroll-y="true" class="content p-3" v-if="allList.length > 0" @scrolltolower="loadMore">
      <view class="order-item bg-white rounded-lg p-3 mb-4" v-for="item in allList" :key="item.id" @click="jumpDetail(item)">
        <view class="flex justify-between items-center">
          <view class="order-sn flex items-end">
            <view class="sn-label">订单编号：</view>
            <view class="sn">{{ item.sn }}</view>
          </view>
          <view class="status" :class="getStatusClass(item)">{{ item.statusLabel }}</view>
        </view>
        <view class="order-name mt-4">物品名称: {{ item.cargo_name }}</view>
        <view class="send flex items-center mt-3">
          <view class="flex flex-col">
            <view class="flex">
              <view class="send-icon flex justify-center items-center rounded-full text-white">发</view>
              <view class="prov ml-1 relative top-[-4rpx]">{{ item.departure_province_name }}-{{ item.departure_city_name }}</view>
            </view>
            <view class="send-add ml-1 pl-[20px]">{{ item.departure_address }}</view>
          </view>
        </view>
        <view class="receive flex items-center mt-2">
          <view class="flex flex-col">
            <view class="flex">
              <view class="receive-icon flex justify-center items-center rounded-full text-white">收</view>
              <view class="prov ml-1 relative top-[-4rpx]">{{ item.destination_province_name }}-{{ item.destination_city_name }}</view>
            </view>
            <view class="receive-add ml-1 pl-[20px]">{{ item.destination_address }}</view>
          </view>
        </view>
        <view class="box-bottom mt-4 flex justify-between items-center">
          <view class="box-left">
            <view class="price flex items-end">
              <view class="price-label">运费合计</view>
              <view class="price-unit mx-1">¥</view>
              <view class="price-txt">{{ item.total_cost || "--" }}</view>
            </view>
            <view class="create-time mt-2 text-xs">{{ item.createtime }}</view>
          </view>
          <view class="box-right">
            <view @click.stop="cancelOrder(item)">
              <wd-button plain custom-class="custom-btn" v-if="item.status === 1 && item.is_valid === 1">取消订单</wd-button>
            </view>
            <view @click.stop="handleApprove(item)">
              <wd-button plain custom-class="custom-btn" v-if="item.action === 3">托运单审核</wd-button>
            </view>
            <view @click.stop="confirmOrder(item)">
              <wd-button plain custom-class="custom-btn" v-if="item.status === 4">签收订单</wd-button>
            </view>
          </view>
        </view>
      </view>
      <view class="noMore" v-if="noMore">我是有底线的</view>
    </scroll-view>
    <view class="content" v-else>
      <no-data tip="暂无订单数据" />
    </view>
    <wd-message-box />
  </view>
</template>

<script lang="ts" setup>
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----变量等------------------------------------------------------------------
import { ref } from "vue";
import NoData from "@/components/NoData/NoData.vue";
import { onShow, onPullDownRefresh } from "@dcloudio/uni-app";
import { orderListsAPI, cacnelOrderAPI, orderSignedAPI } from "@/service/index";
import { Toast, transCodeToName } from "@/utils/utils";
import { ORDER_STATUS } from "@/utils/dict";
import dayjs from "dayjs";
import { getCodeMap } from "@/utils/area";
import { useMessage } from "wot-design-uni";
const message = useMessage();
const tabs = [
  { id: 1, name: "全部", status: "" },
  { id: 2, name: "待承接", status: "1" },
  { id: 3, name: "已承接", status: "2" },
  { id: 4, name: "运输中", status: "3" },
  { id: 5, name: "已送达", status: "4" },
  { id: 6, name: "已签收", status: "5" },
  { id: 7, name: "已损坏", status: "6" },
  { id: 8, name: "已取消", status: "7" },
];
const curTab = ref(0);
const codeMap = getCodeMap();

const allList = ref([]);
const curPage = ref(1); // 当前页
const totalPage = ref(0); // 总页数
const noMore = ref(false);
// #endregion ========================================================================
/// ///////////////////////////////////////////////////////////////////////////////
// #region ----初始化,生命周期等-------------------------------------------------------
onShow(() => {
  curPage.value = 1;
  queryList();
});

onPullDownRefresh(() => {
  curPage.value = 1;
  queryList();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----操作方法----------------------------------------------------------------
function queryList(isMore = false) {
  const params: any = {
    status: tabs[curTab.value].status ? tabs[curTab.value].status : "",
    page_no: curPage.value,
    page_size: 10,
  };
  // 已取消状态特殊处理
  if (params.status === "7") {
    params.status = "";
    params.is_valid = 0;
  }
  uni.showLoading({
    title: "加载中....",
  });
  noMore.value = false;
  orderListsAPI(params).then((res: any) => {
    if (res && res.code === 1) {
      uni.hideLoading();
      let data = res.data.lists || [];
      // 数据转换
      data = data.map(
        (item: {
          status: any;
          departure_province_code: string | number;
          departure_city_code: string | number;
          departure_district_code: string | number;
          destination_province_code: string | number;
          destination_city_code: string | number;
          destination_district_code: string | number;
          public_time: number;
        }) => {
          return {
            ...item,
            statusLabel: formatLabel(item),
            departure_province_name: codeMap[item.departure_province_code],
            departure_city_name: codeMap[item.departure_city_code],
            departure_district_name: codeMap[item.departure_district_code],
            destination_province_name: codeMap[item.destination_province_code],
            destination_city_name: codeMap[item.destination_city_code],
            destination_district_name: codeMap[item.destination_district_code],
            createtime: dayjs(item.public_time * 1000).format("YYYY-MM-DD HH:mm:ss"),
          };
        },
      );
      if (isMore) {
        allList.value = allList.value.concat(data);
      } else {
        allList.value = data;
      }
      totalPage.value = res.data.total_page;
    } else {
      Toast(res.msg);
    }
  });
}

/** 确认签收 */
function confirmOrder(item) {
  message
    .confirm({
      msg: "是否确认签收托运单",
      title: "提示",
    })
    .then(() => {
      orderSignedAPI({ order_id: item.id }).then((res: any) => {
        if (res && res.code === 1) {
          Toast("签收成功");
          curPage.value = 1;
          queryList();
        } else {
          Toast("签收异常");
        }
      });
    })
    .catch(() => {});
}

// 格式化状态label
function formatLabel(item: any) {
  // 已取消的特殊处理
  if (item.status === 1 && item.is_valid === 0) {
    return "已取消";
  } else {
    return transCodeToName(ORDER_STATUS, item.status);
  }
}

// change tab
function handleChange(e: { index: number }) {
  curPage.value = 1;
  curTab.value = e.index;
  queryList(false);
}

// 跳转详情
function jumpDetail(item: any) {
  uni.navigateTo({
    url: `/pages/orderDetail/orderDetail?id=${item.id}`,
  });
}

// 托运单审核
function handleApprove(item: any) {
  uni.navigateTo({
    url: `/pages/orderDetail/orderDetail?id=${item.id}&type=approve`,
  });
}

// 加载更多
function loadMore() {
  if (curPage.value < totalPage.value) {
    curPage.value++;
    noMore.value = false;
    queryList(true);
  } else {
    noMore.value = true;
  }
}

// 取消订单
function cancelOrder(item: any) {
  uni.showModal({
    title: "提示",
    content: "确定取消该订单吗？",
    success: (res: any) => {
      if (res.confirm) {
        const params = {
          order_id: item.id,
        };
        cacnelOrderAPI(params).then((res: any) => {
          if (res && res.code === 1) {
            Toast("取消成功", () => {
              queryList();
            });
          } else {
            Toast(res.msg);
          }
        });
      }
    },
  });
}
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----组件-------------------------------------------------------------------
// #endregion ========================================================================
/// //////////
// #endregion ========================================================================
/// //////////////////////////////////////////////////////////////////////////////////
// #region ----其他方法----------------------------------------------------------------
function getStatusClass(item: { status: any }) {
  switch (item.status) {
    case 1:
      return "status-1";
    case 2:
      return "status-2";
    case 3:
      return "status-3";
    case 4:
      return "status-4";
    case 5:
      return "status-5";
    case 6:
      return "status-6";
  }
}
// #endregion ========================================================================
/// /////////////////////////////////////////////////////////////////////////////////
</script>

<style lang="scss" scoped>
.order-list {
  .content {
    box-sizing: border-box;
    height: calc(100vh - 90rpx);

    .order-sn {
      color: #80808d;

      .sn-label {
        font-size: 32rpx;
      }

      .sn {
        font-size: 30rpx;
      }
    }

    .order-name {
      font-size: 28rpx;
      font-weight: bold;
    }

    .status {
      font-size: 26rpx;
    }

    .send-icon {
      width: 20px;
      height: 20px;
      font-size: 12px;
      background: #2698f7;
    }

    .send-add {
      font-size: 26rpx;
    }

    .receive-add {
      font-size: 26rpx;
    }

    .receive-icon {
      width: 20px;
      height: 20px;
      font-size: 12px;
      background: #ff5b00;
    }

    .price {
      .price-label {
        font-size: 26rpx;
        font-weight: bold;
      }

      .price-unit {
        font-size: 26rpx;
        font-weight: bold;
        color: #ee6d17;
      }

      .price-txt {
        font-size: 30rpx;
        font-weight: bold;
        color: #ee6d17;
      }
    }

    .create-time {
      color: #80808d;
    }
  }
}
</style>
