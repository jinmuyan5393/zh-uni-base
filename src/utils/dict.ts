/**
 * 下拉框业务字典表
 * 格式：[{ label: xxx, value: xxx }, { label: xxx, value: xxx }]
 */

// eg: 支付状态
export const PAY_STATUS = [
  {
    value: 1,
    label: "待支付",
  },
  {
    value: 2,
    label: "已支付",
  },
];

/**
 * 性别 (1:男,2:女)
 */
export const SEX = [
  {
    value: 0,
    label: "请选择",
  },
  {
    value: 1,
    label: "男",
  },
  {
    value: 2,
    label: "女",
  },
];

/**
 * 车型(1:厢式,2:平板,3:高栏,4:冷藏车,5:飞翼车,6:开顶,7:侧板可拆)
 */
export const CAR_TYPE = [
  {
    value: 1,
    label: "厢式",
  },
  {
    value: 2,
    label: "平板",
  },
  {
    value: 3,
    label: "高栏",
  },
  {
    value: 4,
    label: "冷藏车",
  },
  {
    value: 5,
    label: "飞翼车",
  },
];

/**
 * 车长(1:4.2m,2: 5.2m, 3: 6.8m, 4:7.6m)
 */
export const CAR_LENGTH = [
  {
    value: 1,
    label: "4.2m",
  },
  {
    value: 2,
    label: "5.2m",
  },
  {
    value: 3,
    label: "6.8m",
  },
  {
    value: 4,
    label: "7.6m",
  },
];

/**
 * 行驶证类型 (1:重型普通货车, 2:重型厢式货车, 3:重型自卸货车, 4:中型封闭货车, 5:中型集装厢车, 6:中型自卸货车, 7:轻型普通货车, 8:轻型厢式货车, 9:轻型自卸货车, 10:重型普通半挂车, 11:中型普通半挂车, 12:轻型普通半挂车, 13:重型普通全挂车, 14:中型普通全挂车 )
 */
export const DRIVING_LICENSE_TYPE = [
  { value: 1, label: "重型普通货车" },
  { value: 2, label: "重型厢式货车" },
  { value: 3, label: "重型自卸货车" },
  { value: 4, label: "中型封闭货车" },
  { value: 5, label: "中型集装厢车" },
  { value: 6, label: "中型自卸货车" },
  { value: 7, label: "轻型普通货车" },
  { value: 8, label: "轻型厢式货车" },
  { value: 9, label: "轻型自卸货车" },
  { value: 10, label: "微型普通货车" },
  { value: 11, label: "微型厢式货车" },
  { value: 12, label: "微型自卸货车" },
  { value: 13, label: "重型普通半挂车" },
  { value: 14, label: "中型普通半挂车" },
  { value: 15, label: "轻型普通半挂车" },
  { value: 16, label: "重型普通全挂车" },
  { value: 17, label: "中型普通全挂车" },
];

/**
 * 货物类型 (1: 大宗, 2:冷藏/加温货物, 3:危险货物, 4: 其他)
 */
export const GOODS_TYPE = [
  { value: 1, label: "大宗" },
  { value: 2, label: "冷藏" },
  { value: 3, label: "加温" },
  { value: 4, label: "危险" },
  { value: 5, label: "其他" },
];

/**包装方式 */
export const PACKAGE_TYPE = [
  { value: 1, label: "件装", unit: "件" },
  { value: 2, label: "箱装", unit: "箱" },
  { value: 3, label: "盒装", unit: "盒" },
  { value: 4, label: "袋装", unit: "袋" },
  { value: 5, label: "散装", unit: "个" },
];

/**付款方式 */
export const PAYMENT_TYPE = [
  { value: 1, label: "现付" },
  { value: 2, label: "到付" },
  { value: 3, label: "货到打卡" },
  { value: 4, label: "月结" },
  { value: 5, label: "回付" },
  { value: 6, label: "贷款扣" },
  { value: 7, label: "欠付" },
];

/**
 * 结算状态 （0:未结算, 1:已结算)
 */
export const SETTLEMENT_TYPE = [
  { value: 0, label: "未结算" },
  { value: 1, label: "已结算" },
];

/**
 * 回收状态 (0.待回收,1.已回收)
 */
export const RECYCLI_TYPE = [
  { value: 0, label: "待回收" },
  { value: 1, label: "已回收" },
];

/**订单状态 */
export const ORDER_STATUS = [
  { value: 1, label: "待承接", type: "primary" },
  { value: 2, label: "已承接", type: "warning" },
  { value: 3, label: "运输中", type: "info" },
  { value: 4, label: "已送达", type: "primary" },
  { value: 5, label: "已签收", type: "success" },
  { value: 6, label: "货物损坏", type: "danger" },
];

/**托运单状态 */
export const CONSIGNMENT_STATUS = [
  { value: 0, label: "联运经营人:待申请", type: "primary" },
  { value: 1, label: "联运经营人:已申请", type: "success" },
  { value: 2, label: "联运经营人:已撤销", type: "warning" },
  { value: 3, label: "管理员:已通过", type: "success" },
  { value: 4, label: "管理员:已拒绝", type: "danger" },
  { value: 5, label: "托运人:已确认", type: "success" },
  { value: 6, label: "托运人:已拒绝", type: "danger" },
];
