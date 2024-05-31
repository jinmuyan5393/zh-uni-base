import { cloneDeep } from "lodash-es";
import { FieldNamesProps } from "@/components/ComTable/interface";
import dayjs from "dayjs";
import { getCodeMap } from "@/utils/area";
/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param  callValue 当前单元格值
 * @param  enumData 字典列表
 * @param  fieldNames label && value && children 的 key 值
 * @param  type 过滤类型（目前只有 tag）
 * @returns
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: "tag") {
  const value = fieldNames?.value ?? "value";
  const label = fieldNames?.label ?? "label";
  const children = fieldNames?.children ?? "children";
  let filterData: { [key: string]: any } = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
  // 判断是否输出的结果为 tag 类型
  if (type == "tag") {
    return filterData?.tagType ? filterData.tagType : "";
  } else {
    return filterData ? filterData[label] : "--";
  }
}

/**
 * @description 处理 ProTable 值为数组 || 无数据
 * @param  callValue 需要处理的值
 * @returns
 * */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (Array.isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param  prop 当前 prop
 * @returns
 * */
export function handleProp(prop: string) {
  const propArr = prop.split(".");
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param  row 当前行数据
 * @param  prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes(".")) return row[prop] ?? "--";
  prop.split(".").forEach(item => (row = row[item] ?? "--"));
  return row;
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator;
    if (current[value] === callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}

/**
 * @description 添加单位
 * @param  value 值 100
 * @param  unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit = "px") => {
  return !Object.is(Number(value), NaN) ? `${value}${unit}` : value;
};

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param data  数据
 * @param props `{ children: 'children' }`
 */

export const treeToArray = (data: any[], props = { children: "children" }) => {
  data = cloneDeep(data);
  const { children } = props;
  const newData = [];
  const queue: any[] = [];
  data.forEach((child: any) => queue.push(child));
  while (queue.length) {
    const item: any = queue.shift();
    if (item[children]) {
      item[children].forEach((child: any) => queue.push(child));
      delete item[children];
    }
    newData.push(item);
  }
  return newData;
};

/**
 * @description 数组转
 * @param data  数据
 * @param props `{ parent: 'pid', children: 'children' }`
 */

export const arrayToTree = (data: any[], props = { id: "id", parentId: "pid", children: "children" }) => {
  data = cloneDeep(data);
  const { id, parentId, children } = props;
  const result: any[] = [];
  const map = new Map();
  data.forEach(item => {
    map.set(item[id], item);
    const parent = map.get(item[parentId]);
    if (parent) {
      parent[children] = parent[children] ?? [];
      parent[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

/**
 * @description 生成唯一 uuid
 * @returns
 */
export function generateUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    const random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

/**
 * 根据code值 转换为对应中文
 * @param sourceList
 * @param code
 * @param valueKey 数组中code对应的key值
 * @param labelKey 数组中label对应的key值
 * @returns label
 */
export function transCodeToName(sourceList: any[], code: any, valueKey = "value", labelKey = "label") {
  let label = "";
  if (!sourceList || !Array.isArray(sourceList)) return "";
  const findItem = sourceList.find((item: any) => String(item[valueKey]) === String(code));
  if (findItem) {
    label = findItem[labelKey] ? findItem[labelKey] : "";
  }

  return label;
}

/**
 * @description 将秒转为对应的时间格式
 * @param  second 秒
 * @param  format 格式 YYYY-MM-DD HH:mm:ss
 */
export function formatTime(second: number, format = "YYYY-MM-DD HH:mm:ss") {
  if (!second) return "";
  if (isNaN(second * 1000)) return;
  return dayjs.unix(second).format(format);
}

/**
 * @description 根据途经点数据，生成路段数据
 * @param  waypoints 途经点
 * @returns 路段数据
 */
export function generateJourneyArray(waypoints: any[]) {
  // 使用map方法处理数组，返回一个新数组
  return waypoints.slice(1).map((current, index) => {
    // 使用解构赋值获取当前对象和前一个对象的出发地和目的地
    const { origin, origin_lat, origin_lng } = waypoints[index];
    const { origin: destination, origin_lat: destination_lat, origin_lng: destination_lng } = current;
    // 创建一个包含出发地和目的地的旅程对象，并将其添加到journeyArray中
    return {
      idx: generateUUID(),
      origin: origin,
      origin_lat: origin_lat,
      origin_lng: origin_lng,
      destination: destination,
      destination_lat: destination_lat,
      destination_lng: destination_lng,
    };
  });
}

/**
 * @description 判断调度方案中，首尾不能是铁路，且中间路段不能出现连续铁路
 * @param scheduleList
 * @returns result { result: boolean, msg: string }
 */
export function checkSchedule(scheduleList) {
  if (scheduleList[0].type === 2 || scheduleList[scheduleList.length - 1].type === 2) {
    return {
      result: false,
      msg: "调度方案不能以铁路作为开始或者结束",
    };
  }

  for (let i = 1; i < scheduleList.length - 1; i++) {
    if (scheduleList[i].type === 2 && scheduleList[i - 1].type === 2) {
      return {
        result: false,
        msg: "调度方案不能连续出现铁路",
      };
    }
  }
  return {
    result: true,
    msg: "",
  };
}

/**
 * 将角度转为弧度
 */
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * 计算两点之间的距离
 * @param origin 起始点
 * @param target 目标点
 * @returns distance 单位km
 */
export function calculateDistance(origin: { latitude: number; longitude: number }, target: { latitude: number; longitude: number }) {
  const earthRadiusKm = 6371;
  const { latitude: lat1, longitude: lon1 } = origin;
  const { latitude: lat2, longitude: lon2 } = target;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c;

  return distance.toFixed(2);
}

/**
 * @description 获取详细地址 (省市区 + 详细地址)
 * @param address { provinceCode: xxx, cityCode: xxx, districtCode: xxx, address: xxx}
 * @returns
 */
export function getAddress(addressInfo) {
  const codeMap = getCodeMap();
  if (!addressInfo) {
    return "";
  }
  const province = codeMap[addressInfo.provinceCode];
  const city = codeMap[addressInfo.cityCode];
  const district = codeMap[addressInfo.districtCode];
  // 拼接地址，剔除空值
  const address = [province, city, district, addressInfo.address].filter((item: any) => item);
  return address.join("-");
}

/**
 * @description base64转为file
 *
 */
export function base64ToFile(base64, fileName) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bytes = atob(arr[1]);
  let n = bytes.length;
  const ia = new Uint8Array(n);
  while (n--) {
    ia[n] = bytes.charCodeAt(n);
  }
  return new File([ia], fileName, { type: mime });
}
