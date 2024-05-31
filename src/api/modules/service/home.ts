/*
 * @Description: 首页统计
 * @Author: jinmuyan
 * @LastEditTime: 2024-04-29 13:45:21
 */
import http from "@/api/index";

/**
 * 订单发布总数统计
 */
export const totalsOrder = () => {
  return http.get("/admin/statistics/totalsOrder");
};

/**
 * 订单已调度(托运人确认托运单时间)
 */
export const schedulingOrder = () => {
  return http.get("/admin/statistics/schedulingOrder");
};

/**
 * 订单损坏(损失审核通过的时间)
 */
export const damageOrder = () => {
  return http.get("/admin/statistics/damageOrder");
};

/**
 * 订单已签收(签收时间)
 */
export const signedOrder = () => {
  return http.get("/admin/statistics/signedOrder");
};

/**
 * 最近30天发布的订单数
 */
export const countLast30DaysOrders = () => {
  return http.get("/admin/statistics/countLast30DaysOrders");
};

/**
 * 柱状图 日月 展示各片区收 发订单
 * area_order_date_type 1.本日, 2.本月
 */
export const areaOrders = (data: any) => {
  return http.get("/admin/statistics/areaOrders", data);
};

/**
 * 获取全部司机当前定位信息
 * area_order_date_type 1.本日, 2.本月
 */
export const runtimePositionDrivers = (data: any) => {
  return http.get("/admin/statistics/runtimePositionDrivers", data);
};
