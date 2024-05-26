/*
 * @Description:
 * @Author: jinmuyan
 * @LastEditTime: 2024-05-21 10:46:54
 */
import { http } from "@/utils/http";

/** 添加订单 */
export const orderAddAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/add`,
    method: "POST",
    data,
  });
};

/** 撤销订单 */
export const cacnelOrderAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/cacnelOrder`,
    method: "POST",
    data,
  });
};

/** 获取订单详情 */
export const orderDetailAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/detail`,
    method: "GET",
    data,
  });
};

/** 订单列表 */
export const orderListsAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/lists`,
    method: "GET",
    data,
  });
};

/** 同意托运单 */
export const orderAgreeAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/agree`,
    method: "POST",
    data,
  });
};

/** 拒绝托运单 */
export const orderRefuseAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/reject`,
    method: "POST",
    data,
  });
};

/** 物流查询 */
export const getOrderLogisticsInfoAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/getOrderLogisticsInfo`,
    method: "GET",
    data,
  });
};

/** 订单签收 */
export const orderSignedAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/signed`,
    method: "POST",
    data,
  });
};

/** 异常订单上报 */
export const reportDamageAPI = (data: any) => {
  return http({
    url: `/consignor/order.order/reportDamage`,
    method: "POST",
    data,
  });
};
